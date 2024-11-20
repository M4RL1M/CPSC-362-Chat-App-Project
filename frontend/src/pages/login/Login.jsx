const Login = () => {
    return <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-gray-100 bg-clip-padding
        backdrop-filter-blur-sm bg-opacity-20 border border-gray-100'> 
            <h1 className='text-3xl font-semibold text-center text-gray-300'>
                Login
                <span className='text-blue-600'> ChatApp </span>
            </h1>

            <form>
                <div>
                    <label className='label p-1 mt-2 italic'>
                        <span className='text-base label-text'>Sign in with your username and password</span>
                    </label>
                    <input type='text' placeholder='Username' 
                    className='w-full input input-border h-10' />
                </div>

                <div className='space-y-2'>
                    <label>
                       {/* <span className='text-base label-text'>Password</span> */}
                    </label> 
                    <input type='password'
                    placeholder='••••••••••'
                    className='w-full input input-borderd h-10' />
                </div>

                <div>
                    <a href='#' className='text-sm hover:underline 
                    hover:text-blue-600 mt-2 inline-block text-blue-400'>
                        {"Don't"} have an account?
                    </a>
                </div>

                <div>
                    <button className='btn btn-block btn-sm mt-1 bg-blue-800 
                    hover:bg-blue-500 border-none'> Login </button>
                </div>

            </form>
        </div>
    </div>;
};
export default Login;
