const GenderCheckbox = ({onCheckboxChange, selectedGender}) => {
    return (
        <div className='flex'>
            <div className='form-control'>
                <label className={`label gap-2 cursor-pointer ${selectedGender === "male" ? "selected" : ""}`} > 
                    <span className='label-text'> Male </span>
                    <input 
                        type='checkbox' 
                        className='checkbox border-slate-900 h-4 w-4' 
                        checked={selectedGender === "male"} 
                        onChange={() => onCheckboxChange("male")} />
                </label>
            </div>

            <div className='form-control'>
                <label className={`label gap-2 ml-5 cursor-pointer ${selectedGender === "female" ? "selected" : ""}`} > 
                    <span className='label-text'> Female </span>
                    <input 
                        type='checkbox' 
                        className='checkbox border-slate-900 h-4 w-4' 
                        checked={selectedGender === "female"} 
                        onChange={() => onCheckboxChange("female")} />
                </label>
            </div>
        </div>
    );
};

export default GenderCheckbox;