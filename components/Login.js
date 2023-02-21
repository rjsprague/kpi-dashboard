export default function Login() {
  return (
    
    <div className="antialiased p-1 mx-auto my-auto justify-center items-center content-center align-middle">
      
      <div className="container md:px-10 mx-auto my-auto justify-center items-center content-center align-middle">

        <section className="xl:gap-10 lg:gap-0 lg:flex lg:flex-row lg:pt-52 md:pt-10 pt-2 mx-auto my-auto justify-center items-center content-center align-middle ">
          <div className="flex container lg:h-80 lg:w-1/2 w:2/3 lg:flex-col content-center align-middle text-center mx-auto lg:p-4 md:p-4 p-8">

            <div className="lg:space-y-10 md:my-auto space-y-4 md:space-y-8 xl:w-2/3 mx-auto w-full">
              <a className="" href="#">
                <img src="/reia-logo.png" alt="" className="mx-auto" />
              </a>
              <div className="text-white lg:text-2xl md:text-left text-center lg:leading-10 font-semibold text-sm md:text-lg ">
                <p>Systemize Everything...</p>
                <p>and close more deals in less time</p>
              </div>
            </div>

          </div>

          <div className="lg:flex lg:flex-col mx-auto lg:w-1/2 lg:p-2 md:p-4 p-8 my-auto md:w-2/3">
            <div className="">
              <div className="text-center">
                <a className="inline-block mx-auto lg:mb-10 md:mb-5 mb-2" href="#">
                  <img src="/reia-icon.webp" alt="" />
                </a>
                <h2 className="text-white font-semibold mb-2 lg:text-2xl text-lg">Log in to your account</h2>
                <p className="text-gray-100 font-medium lg:mb-10 mb-5">Welcome back! Please enter your details.</p>
                <form action="" className="mx-auto my-auto justify-center items-center content-center align-middle">
                {/*  <div className="relative border border-blue-400 hover:border-white focus-within:border-green-200 rounded-lg w-full content-center lg:p-3 md:p-2 p-1 lg:mb-8 mb-4">
                    <span className="absolute bottom-full left-0 ml-3 -mb-1 transform translate-y-0.5 text-xs font-semibold text-gray-100 px-1 bg-blue-600">Email</span>
                    <input className="block w-full outline-none bg-transparent text-gray-100 font-medium text-lg p-1 pl-3" id="signInInput4-1" type="email" placeholder="myemail@email.com" name="" />
                  </div>
                  <div className="relative w-full border border-blue-400 hover:border-white focus-within:border-green-200 rounded-lg lg:p-3 md:p-2 p-1 md:mb-6 mb-3">
                    <span className="absolute bottom-full left-0 ml-3 -mb-1 transform translate-y-0.5 text-xs font-semibold text-gray-100 px-1 bg-blue-600">Password</span>
                    <input className="block w-full outline-none bg-transparent text-sm text-gray-100 font-medium md:text-lg pl-3" id="signInInput4-2" type="password" placeholder="" name="" />
                  </div>
                  <div className="flex md:justify-around md:items-center md:mb-6 mb-3 md:flex-wrap items-center">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <input id="signInInput4-3" type="checkbox" />
                      <label className="ml-2 text-xs text-gray-300 font-semibold" htmlFor=''>Remember for 30 days</label>
                    </div>
                    <div className="w-full sm:w-auto"><a className="inline-block text-xs font-semibold text-blue-500 hover:text-blue-600" href="#">Forgot password?</a></div>
                  </div>
                  <button className="block w-full mb-4 leading-6 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-200 lg:py-4 md:py-3 py-2">Sign In</button>
                */}
                  <a className="flex items-center w-1/2 content-center justify-center mb-6 leading-6 border-2 shadow-gray-400 shadow-md border-blue-50 text-blue-100 font-semibold bg-blue-900 hover:bg-blue-800 hover:text-gray-100 rounded-lg transition duration-500 py-2 lg:py-4 md:py-3 mx-auto" href="#">
                    <div className="">
                      <svg width="40" height="40" viewBox="0 0 256 303" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M219.773 37.656c-50.013-50.01-131.28-50.212-181.55-.576l-.59.587c-50.19 50.218-50.174 131.91.03 182.109l77.545 77.531a17.268 17.268 0 0 0 12.254 5.073c4.433 0 8.879-1.686 12.262-5.073 6.761-6.77 6.761-17.748 0-24.515l-77.557-77.538c-36.576-36.57-36.693-96.026-.34-132.75l.354-.347c36.698-36.675 96.399-36.664 133.074.012 30.116 30.118 34.438 81.659 10.034 119.904-5.147 8.064-2.776 18.782 5.288 23.93 8.083 5.164 18.787 2.782 23.93-5.279 33.489-52.474 27.29-121.047-14.734-163.068M188.74 223.752c6.765 6.77 6.773 17.749 0 24.51a17.224 17.224 0 0 1-12.244 5.087 17.322 17.322 0 0 1-12.274-5.078L86.68 170.74c-23.165-23.172-23.165-60.883 0-84.06 11.225-11.214 26.147-17.396 42.02-17.396h.017c15.87 0 30.794 6.19 42.011 17.422a59.397 59.397 0 0 1 14.916 59.06c-2.756 9.173-12.395 14.396-21.572 11.65-9.174-2.735-14.396-12.395-11.663-21.574a24.742 24.742 0 0 0-6.2-24.626c-4.677-4.683-10.885-7.26-17.5-7.263h-.01c-6.616 0-12.824 2.574-17.504 7.246-9.654 9.654-9.654 25.367 0 35.023l77.545 77.529" fill="#5088AC" /></svg>
                      </div>
                    <span className="ml-3 text-lg">Sign In with Podio</span>
                  </a>
                  <p className="font-medium">
                    <span className="text-gray-300 pr-3">Don’t have an account?</span>
                    <a className="inline-block text-blue-500 hover:underline" href="#">Sign up</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
     <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
      <script src="js/charts-demo.js"></script>
    </div>
    
  );
}