import { Outlet, Link, useNavigate } from "react-router-dom";
import Logo from './../Images/logo.png';
import Up_arrow from './../Images/up-right-arrow.svg';
import Container from 'react-bootstrap/Container';

const Footer = ({setModal}) => {
  const navigate = useNavigate()
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional smooth scrolling behavior
    });
  };
  return (
    <>
      <div className='footer'>
      <Container>
          <div className='footer_top'>
              <div className="brand-logo" style={{cursor:"pointer"}} onClick={() => {
                scrollToTop()
                navigate("/")
              }}>
                  <img src={Logo} alt="Logo" />
              </div>
              <div>
                <button className="btn_green" onClick={() => setModal(true)}>Let's Talk</button>
                <div className="ftr-login">
                  <p className="title">Expert Login <img src={Up_arrow} alt="Up arrow" /></p>
                  <p>+1 (000) 547-5487</p>
                </div>
              </div>
          </div>
          <div className='footer_bottom'>
              <div>
                  <p>© Crack-it 2023. All rights reserved.</p>
              </div>
              <div>
                <p><span style={{cursor:"pointer"}} onClick={() => {
              scrollToTop()

                  navigate("/terms-conditions")
              }}>TERMS & CONDITIONS</span> | <span style={{cursor:"pointer"}} onClick={() => {
                scrollToTop()

                navigate("/privacy-policy")
              }}>PRIVACY POLICY</span></p>

              </div>
          </div>
          </Container>
        </div>
    </>
  )
};

export default Footer;