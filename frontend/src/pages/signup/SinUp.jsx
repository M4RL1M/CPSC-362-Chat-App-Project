import GenderCheckbox from "./GenderCheckbox";

const SignUp = () => {
    return <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-gray-100 bg-clip-padding
        backdrop-filter-blur-sm bg-opacity-20 border border-gray-100'>
            <h1 className='text-3xl font-semibold text-center text-gray-300'>
                Sign Up 
                <span className='text-blue-600'> ChatApp </span>
            </h1>

            <form>
                <div>
                    <label className='label p-0 mt-2 ml-4 italic'>
                     <span className='text-base label-text'> Full name: </span>   
                    </label>
                    <input type='text' placeholder='John Doe' 
                    className='w-full input input-border h-10' />
                </div>

                <div>
                    <label className='label p-0 mt-2 ml-4 italic'>
                     <span className='text-base label-text'> Username: </span>   
                    </label>
                    <input type='text' placeholder='JohnD123' 
                    className='w-full input input-border h-10' />
                </div>

                <div>
                    <label className='label p-0 mt-2 ml-4 italic'>
                     <span className='text-base label-text'> Password: </span>   
                    </label>
                    <input type='password' placeholder='••••••••••' 
                    className='w-full input input-border h-10' />
                </div>

                <div>
                    <label className='label p-0 mt-2 ml-4 italic'>
                     <span className='text-base label-text'> Confirm Password: </span>   
                    </label>
                    <input type='password' placeholder='••••••••••' 
                    className='w-full input input-border h-10' />
                </div>

                <GenderCheckbox />

                <div>
                    <a href='#' className='text-sm hover:underline 
                    hover:text-blue-600 mt-2 inline-block text-blue-400'>
                        Already have an account?
                    </a>
                </div>

                <div>
                    <button className='btn btn-block btn-sm mt-1 bg-blue-800 
                    hover:bg-blue-500 border-none'> Sign Up </button>
                </div>

            </form>
        </div>
    </div>
};
export default SignUp;