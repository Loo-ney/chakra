import { ChakraProvider } from '@chakra-ui/react'
import ProductsScreen from './screens/ProductsScreen';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Header from './components/Header';
import LandingScreen from './screens/LandingScreen';
import ProductScreen from './screens/ProductScreen';


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
          </Routes>
        </main>
        
      </Router>
    </ChakraProvider>
  );
}

export default App;