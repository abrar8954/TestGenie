import React from 'react';
import { useUtility } from '../../../providers/utility-provider';
import AnimatedText from '../../components/animated_text';
import Settings from '../settings';

const Main: React.FC = () => {
    const { animStatus } = useUtility();

    return (

        <div style={{ backgroundColor: '#1e1e2e', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            {
                animStatus ?
                    <AnimatedText />
                    :
                    <Settings />
            }
        </div>


    );
};

export default Main;
