import { useState } from "react"

const SignUpPage = () => {
  // Stata variables
  const [email, setEmail] = useState("")

  //Handlers for input
  const handleEmailChange = (changedValue) => {
    setEmail(changedValue)
  }
    return (
      <div>
        <h1 className="text-center">Sign up now</h1>
      </div>
    )
  }
  
  export default SignUpPage