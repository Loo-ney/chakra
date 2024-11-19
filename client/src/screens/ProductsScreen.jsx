import { Box, Center, Wrap, WrapItem } from '@chakra-ui/react'
import axios from 'axios'; //make get req to server
import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/actions/productActions';

const ProductsScreen = () => {
  // removing this because redux is taking care of it
  // const [data, setData] = useState([]); //hook from react
  // useEffect(() => {
  //   axios
  //     .get('/api/products')
  //     .then((response) => {
  //     setData(response.data.products);
  //   })
  //   .catch((error) => {
  //     console.error('Error fetching data:', error);
  //   });
  // }, []);
  const dispatch = useDispatch();
  const {loading, error, products, pagination} = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  },[dispatch]);


  return (
    <> 
      {products.length > 1 && (
         <Box>
          <Wrap spacing='30px' justify='center' minHeight='80vh' mx={{ base: '12', md: '20', lg: '32' }}>
             {products.map((product) =>(
              <WrapItem key={product._id}>
                <Center w='250px' h='450px'>
                <ProductCard product= {product}  loading={loading} />  {/*loading comes from redux*/}
                </Center>
              </WrapItem>
             ))}
          </Wrap>
         </Box>
      )} 
    </>
  );
};

export default ProductsScreen;
