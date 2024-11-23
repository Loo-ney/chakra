import { ChakraProvider } from '@chakra-ui/react'
import ProductsScreen from './screens/ProductsScreen';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Header from './components/Header';
import LandingScreen from './screens/LandingScreen';
import ProductScreen from './screens/ProductScreen';
import Footer from './components/Footer';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import RegistrationScreen from './screens/RegistrationScreen';


function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      {/* Rest of our app */}
      <Router>
        <Header />
        <main>
          <Routes>
          <Route path='/products' element={<ProductsScreen />} /> {/* all products route */}
            <Route path='/' element={<LandingScreen />} /> {/* homescreen route */}
            <Route path='/product/:id' element={<ProductScreen />} /> {/* single product route */}
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/email-verify/:token' element={<EmailVerificationScreen />} />
            <Route path='/password-reset/:token' element={<PasswordResetScreen />} />
            <Route path='/registration' element={<RegistrationScreen />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ChakraProvider>
  );
}

export default App;