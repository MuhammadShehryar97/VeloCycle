import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RunScreen from './src/screens/RunScreen/index';

const App = () => {  
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#0F172A' }/>
      <RunScreen />
    </SafeAreaProvider>
  );
}

export default App;