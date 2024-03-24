import Carousel from './Carousel';
import CargoShip from '../../assets/images/cargo-ship.jpg';
import DeliveryBoxes from '../../assets/images/delivery-boxes.jpg';
import GoldCoins from '../../assets/images/gold-and-coins.jpg';

const CarouselImages = () => {
//   const images = [CargoShip, DeliveryBoxes, GoldCoins];

    const images = [
      {
        src: CargoShip,
        title: 'Import & Export',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero in dui sollicitudin, nec aliquet nunc tincidunt',
        button: 'Learn More',
        button2: 'Get Quote'
      },
      {
        src: DeliveryBoxes,
        title: 'Door to Door Delivery',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero in dui sollicitudin, nec aliquet nunc tincidunt',
        button: 'Learn More',
        button2: 'Get Quote'
      },
      {
        src: GoldCoins,
        title: 'Secure Storage',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero in dui sollicitudin, nec aliquet nunc tincidunt',
        button: 'Learn More',
        button2: 'Get A Quote'
      }
    ];

  return (
    <Carousel images={images} />
  );
}

export default CarouselImages;
