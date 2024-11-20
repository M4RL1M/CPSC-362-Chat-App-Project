const Message = () => {
    return (
        <div className='chat chat-end'> 
            <div className='chat-image avatar'>
                <div className='w-10 h-10 rounded-full'>
                    <img 
                        alt='Tailwind CSS chat bubble component' 
                        src='https://cdn4.iconfinder.com/data/icons/fluent-solid-20px-vol-5/20/ic_fluent_person_20_filled-250.png'
                    />
                </div>
            </div>

            <div className='chat-bubble text-white bg-blue-500'> 
                Hi! What's up?
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
                12:42
            </div>
        </div>
    );
};

export default Message;