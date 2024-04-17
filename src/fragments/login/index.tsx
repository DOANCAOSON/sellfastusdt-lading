import { Animation } from '@/components/Animation'
import { ButtonLoad } from '@/components/ButtonLoad'
import { FormInputEnum, FormProvider } from '@/components/Form'
import { MATCH_EMAIL } from '@/constants/app'
import { auth, auth as authAtom, logout, signIn } from '@/store/auth-store'
import { dispatchNotification } from '@/store/notify-store'
import { getCookie, hideEmail, removeCookie, setCookie } from '@/utils'
import { useEffect, useRef, useState } from 'preact/compat'
import { NotificationType } from '../../components/notification'

const contentText = {
  successTitle: 'Registration Successful',
  successMessage: 'Please check your email to confirm registration.',
  errorMessage: 'You need to enter a valid email.',
  infoMessage: 'Your session has expired or you need to log in to use our services. ',
  mailLink: 'your gmail',
  expirationMessage1: 'To maintain security, do not share the content of your received mail with anyone.',
  expirationMessage2: 'Your email will expire within 30 minutes.',
  expirationMessage3: 'If there are errors during use, please contact us via chatbox',
  title: 'Login',
  inputLabel: 'Enter email',
  btnLabel: 'Sign in',
  note: 'Note',
  inputPlaceholder: 'Email Address',
  required: 'Enter an email',
  pattern: 'Enter a valid email'
}

const inputs = [
  {
    name: 'email',
    type: FormInputEnum.INPUT,
    required: { value: true, message: contentText.required },
    pattern: { value: MATCH_EMAIL, message: contentText.pattern },
    placeholder: contentText.inputPlaceholder,
    label: contentText.inputLabel,
    className: 'form-input'
  }
]

const LoginForm = ({ setLogged }: { setLogged: (bo: boolean) => void }) => {
  const logged = authAtom?.get().auth

  const formRef = useRef(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (logged) return logout()
  }, [logged])

  const onSubmit = async (event: any) => {
    event.preventDefault()
    const {
      current: { formValues }
    } = formRef as any
    const { email } = formValues()
    if (!!email) {
      setLoading(true)
      signIn(
        { email },
        (message: string) => {
          dispatchNotification(NotificationType.ERROR, message)
          setLoading(false)
        },
        (createdAt) => {
          createdAt && setLogged(true)
          setCookie('email', email, '')
          setLoading(false)
        }
      )
    }
  }

  return (
    <div className='px-2 py-0 mx-auto lg:py-20 mt-10'>
      <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 '>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl '>
            {contentText.title}
          </h1>
          <FormProvider inputs={inputs} ref={formRef} className='space-y-4 md:space-y-6'>
            <ButtonLoad
              className='w-full text-white bg-[#32ae31] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
              onClick={onSubmit}
              type='submit'
              label={contentText.btnLabel}
              loading={loading}
            />
          </FormProvider>
          <p className='text-sm font-light text-gray-500 '>
            <div class='flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 ' role='alert'>
              <svg
                class='flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'>
                <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
              </svg>
              <span class='sr-only'>Info</span>
              <div>
                <span class='font-medium'>
                  {contentText.infoMessage}{' '}
                  <a href='https://mail.google.com/' className='decoration-inherit'>
                    {contentText.mailLink}
                  </a>
                </span>
                <ul class='mt-1.5 list-disc list-inside'>
                  <li>{contentText.expirationMessage1}</li>
                  <li>{contentText.expirationMessage2}</li>
                  <li>{contentText.expirationMessage3}</li>
                </ul>
              </div>
            </div>
          </p>
        </div>
      </div>
    </div>
  )
}

const LoggedSuccess = () => {
  const email = getCookie('email') ?? ''
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(new Array(4).fill(''))
  const verified = useRef<boolean>(false)

  const handleChange = (element: any, index: number) => {
    const keyCode = element.keyCode
    const value = element.target.value
    if (keyCode === 8) {
      if (otp[index] !== '') {
        setOtp([...otp.map((d, idx) => (idx === index ? '' : d))])
      }
      if (element.target.previousSibling && index > 0) {
        ;(element.target.previousSibling as HTMLInputElement).focus()
      }
      return
    }

    if (isNaN(value)) return false
    setOtp([...otp.map((d, idx) => (idx === index ? value : d))])
    if (element.target.nextSibling) {
      element.target.nextSibling.focus()
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const otpCode = otp.join('')
      const res = await fetch('/api/confirm', {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      })
      const data = await res.json()

      if (data?.id) {
        auth.set({ auth: data })
        removeCookie('email')
        location.replace('/')
      } else {
        verified.current = true
        dispatchNotification(NotificationType.ERROR, 'Code has expired. Please request again.')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async (e: any) => {
    e.preventDefault()
    setOtp(new Array(4).fill(''))
    try {
      const res = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (data?.otp) {
        verified.current = false
        dispatchNotification(NotificationType.SUCCESS, 'A new code has been sent.')
      } else {
        dispatchNotification(NotificationType.ERROR, 'Resend code failed')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Animation animationName='fadeIn' duration={0.2} className='card-wrapper border rounded-3 h-100'>
      <div className='authenticate'>
        <h4>Verification code</h4>
        <img className='img-fluid' src='/assets/images/authenticate.png' alt='authenticate' />
        <span>We've sent a verification code to</span>
        <span>{hideEmail(email)}</span>
        <form className='row' onSubmit={onSubmit}>
          <div className='col'>
            <h5>Your OTP Code here:</h5>
          </div>
          <div className='col otp-generate'>
            {otp.map((data, index) => (
              <input
                className='form-control code-input border-[3px] border-solid border-[#30d933]'
                type='text'
                maxLength={1}
                pattern='[0-9]'
                required
                key={index}
                value={data}
                onKeyUp={(e) => handleChange(e, index)}
              />
            ))}
          </div>
          <div className='col'>
            <ButtonLoad
              loading={loading}
              label={loading ? 'Verifying...' : 'Verify'}
              isDisable={loading || verified.current}
              className='btn btn-primary w-100 p-3 text-gray-50'
              type='submit'
            />
          </div>
          <div>
            <span>Not received your code?</span>
            <span>
              <a href='#' onClick={resendOTP} class='text-green-600'>
                RESEND
              </a>
            </span>
          </div>
        </form>
      </div>
    </Animation>
  )
}

const LoginScreen = () => {
  const [logged, setLogged] = useState(false)

  return (
    <div className='flex justify-center items-center px-[20px] lg:px-[0px] mt-10'>
      {logged ? <LoggedSuccess /> : <LoginForm setLogged={setLogged} />}
    </div>
  )
}

export default LoginScreen
