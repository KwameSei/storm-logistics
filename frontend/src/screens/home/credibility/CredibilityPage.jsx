import CargoTruck from '../../../assets/images/cargo-truck2.jpg'
import classes from './Credibility.module.scss';

const CredibilityPage = () => {

  return (
    <div className={classes.credibility}>
      <div className={classes.credibility_main}>
        <div className={classes.credibility_content}>
          <img src={CargoTruck} alt='logistics image' className={classes.credibility_background} />
          <div className={classes.content_overlay}>
            <div className={classes.content_sub1}>
              <h1 className={classes.heading}>
                ENTRUST US WITH YOUR LOGISTICS NEEDS
              </h1>
              <p className={classes.sub_heading}>
                Statistics prove that we are 100% devoted to our job of booking, processing and transferring the orders across the globe with minimum effort for our clients!
              </p>
            </div>
            <div className={classes.content_sub2}>
              <p className={classes.text}>
                <span>106</span> Connected Countries
              </p>
              <p className={classes.text}>
                <span>300k+</span> Closed Shipments
              </p>
              <p className={classes.text}>
                <span>80k+</span> Satisfied Clients
              </p>
              <p className={classes.text}>
                <span>25</span> Years of Experience
              </p>
            </div>
          </div>
        </div>

        <div className={classes.credibility_content2}>
          <div className={classes.section1}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae dolor ab ipsam distinctio laborum quisquam delectus quae facere aliquid. Dolorum numquam voluptates dolor exercitationem magni error necessitatibus fugiat? Harum, dignissimos.</div>
          <div className={classes.section2}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eveniet nulla perspiciatis recusandae quas excepturi? Eveniet incidunt non laudantium quo laborum harum. Sed beatae illum temporibus maiores deserunt fugit amet.</div>
        </div>
      </div>
    </div>
  )
}

export default CredibilityPage;