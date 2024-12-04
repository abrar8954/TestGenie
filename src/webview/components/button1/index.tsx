import React from 'react';

interface Button1Props {
    text: string;
    onClick: () => void;
}

const Button1: React.FC<Button1Props> = ({ text, onClick }) => {
    const button1Style = {
        backgroundColor: '#1E1E1E', // Black background
        color: "#fff",
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 600,
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginTop: '15px'
    };

    return (
        <button style={button1Style} onClick={() => onClick()}>
            {text}
        </button>
    );
};

export default Button1;
