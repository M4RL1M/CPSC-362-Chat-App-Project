const GenderCheckbox = () => {
    return (
        <div className='flex'>
            <div className='form-control'>
                <label className='label gap-2 cursor-pointer'> 
                    <span classname='label-text'> Male </span>
                    <input type='checkbox' className='checkbox border-slate-900 h-4 w-4' />
                </label>
            </div>

            <div className='form-control'>
                <label className='label gap-2 cursor-pointer ml-5'> 
                    <span classname='label-text'> Female </span>
                    <input type='checkbox' className='checkbox border-slate-900 h-4 w-4' />
                </label>
            </div>
        </div>
    );
};

export default GenderCheckbox;