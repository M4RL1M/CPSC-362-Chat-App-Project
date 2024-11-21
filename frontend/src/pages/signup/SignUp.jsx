import GenderCheckbox from "./GenderCheckbox";
import { Link } from 'react-router-dom';
import { useState  } from 'react';
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: ''
    });

    const { loading, signup } = useSignup();

    const handleCheckboxChange = (gender) => {
        setInputs({...inputs, gender})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs)
    };

    return <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-gray-100 bg-clip-padding
        backdrop-filter-blur-sm bg-opacity-20 border border-gray-100'>
            <h1 className='text-3xl font-semibold text-center text-gray-300'>
                Sign Up 
                <span className='text-blue-600'> ChatApp </span>
            </h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label className='label p-0 mt-2 ml-4 italic'>
                     <span className='text-base label-text'> Full name: </span>   
                    </label>
                    <input type='text' placeholder='John Doe' 
                    className='w-full input input-border h-10' 
                    value={inputs.fullName}
                    onChange={(e) => setInputs({...inputs, fullName: e.target.value})} />
                </div>

                <div>
                    <label className='label p-0 mt-2 ml-4 italic'>
                     <span className='text-base label-text'> Username: </span>   
                    </label>
                    <input type='text' placeholder='JohnD123' 
                    className='w-full input input-border h-10' 
                    value={inputs.username}
                    onChange={(e) => setInputs({...inputs, username: e.target.value})} />
                </div>

                <div>
                    <label className='label p-0 mt-2 ml-4 italic'>
                     <span className='text-base label-text'> Password: </span>   
                    </label>
                    <input type='password' placeholder='••••••••••' 
                    className='w-full input input-border h-10' 
                    value={inputs.password}
                    onChange={(e) => setInputs({...inputs, password: e.target.value})} />
                </div>

                <div>
                    <label className='label p-0 mt-2 ml-4 italic'>
                     <span className='text-base label-text'> Confirm Password: </span>   
                    </label>
                    <input type='password' placeholder='••••••••••' 
                    className='w-full input input-border h-10' 
                    value={inputs.confirmPassword}
                    onChange={(e) => setInputs({...inputs, confirmPassword: e.target.value})} />
                </div>

                <GenderCheckbox 
                    onCheckboxChange={handleCheckboxChange} 
                    selectedGender={inputs.gender}
                />

                <div>
                    <Link to='/login' className='text-sm hover:underline 
                    hover:text-blue-600 mt-2 inline-block text-blue-400'>
                        Already have an account?
                    </Link>
                </div>

                <div>
                    <button className='btn btn-block btn-sm mt-1 bg-blue-800 
                    hover:bg-blue-500 border-none' disabled={ loading }> 
                        { loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
                    </button>
                </div>

            </form>
        </div>
    </div>
};
export default SignUp;