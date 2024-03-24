import { Facebook, Instagram, LinkedIn, LocationOn, Mail, Phone, X, YouTube } from '@mui/icons-material';
import Logo from '../../assets/storm-logo.jpg'
import classes from './Footer.module.scss';

const Footer = () => {

  return (
    <div className={classes.footer}>
      <div className={classes.footer_overlay}>
      <div className={classes.footer_main}>
        <div className={classes.footer_section}>
          <div className={classes.footer_logo}>
            <img src={Logo} alt='Logo' className={classes.logo_img} />
          </div>
          <div className={classes.section1_text}>
            Join thousands of businesses making the right shipping decisions with our all-in-one intelligent freight platform. We help you transport freight faster, cheaper, safer, and easier, so you can stay focused on your business.
          </div>
        </div>
        <div className={classes.footer_section}>
          <div className={classes.head}>
            Main Services
          </div>
          <ul className={classes.unordered}>
            <li className={classes.list}>Brokerage</li>
            <li className={classes.list}>Cargo Insurance</li>
            <li className={classes.list}>Forwarding</li>
            <li className={classes.list}>Logistics</li>
            <li className={classes.list}>Sully Chain</li>
            <li className={classes.list}>Warehousing</li>
          </ul>
        </div>
        <div className={classes.footer_section}>
          <div className={classes.head}>
            Useful Links
          </div>
          <ul className={classes.unordered}>
            <li className={classes.list}>FAQ</li>
            <li className={classes.list}>Get a Quote</li>
            <li className={classes.list}>Our Benefits</li>
            <li className={classes.list}>Our Features</li>
            <li className={classes.list}>Our Services</li>
            <li className={classes.list}>Contacts</li>
          </ul>
        </div>
        <div className={classes.footer_section}>
          <div className={classes.head}>
            Contacts
          </div>
          <div className={classes.contacts}>
            <div className={classes.contact_item}><Phone /> +233303956032 </div>
            <div className={classes.contact_item}><Mail /> support@stormlogistics.com </div>
            <div className={classes.contact_item}><LocationOn /> Mile 7 Road, Behind Ecobank, Achimota </div>
          </div>
          <div className={classes.social}>
            <Facebook className={classes.social_item} />
            <X className={classes.social_item} />
            <LinkedIn className={classes.social_item} />
            <Instagram className={classes.social_item} />
            <YouTube className={classes.social_item} />
          </div>
        </div>
      </div>
      <div className={classes.copyright}>
        Developed by Storm Logistics. All Rights Reserved
      </div>
      </div>
    </div>
  )
}

export default Footer;