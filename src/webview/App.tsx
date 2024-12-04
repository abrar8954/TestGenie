import React from 'react';
import { UtilityProvider } from '../providers/utility-provider';
import Main from './screens/main';

const App: React.FC = () => {

    return (
        <UtilityProvider>
            <Main />
        </UtilityProvider>

    );
};

export default App;
