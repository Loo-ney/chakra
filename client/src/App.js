import { ChakraProvider } from '@chakra-ui/react'
import ProductsScreen from './screens/ProductsScreen';

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      {/* Rest of our app */}
      <ProductsScreen />
    </ChakraProvider>
  )
}

export default App;