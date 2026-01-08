import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCart } from '../context/Cart/CartContext';

interface Props{
    _id:string,
    title: string,
    description: string,
    image: string,
    price: number
}

export default function ProductCard({_id, title, description, image, price}:Props) {
  const {addItemToCart} = useCart();

  
  return (
    <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        sx={{ 
          height: 150,
          objectFit: 'contain'
        }}
        image={image}
        title={title}
      />
      <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {description}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {price} TL
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant='contained' size="small" onClick={()=> addItemToCart(_id)}>Add To Cart</Button>
      </CardActions>
    </Card>
  );
}

