import React from 'react';
import ReactDOM from 'react-dom';

export const Modal = ({ children, onClose }) => {
    return ReactDOM.createPortal(
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-lg w-96'>
                <button 
                    className='absolute top-2 right-2 text-gray-500 hover:text-gray-700' 
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};