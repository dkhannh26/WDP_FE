import { Color } from 'antd/es/color-picker';
import React from 'react';

const Style = {
    color: '#e67e22',
    fontStyle: 'italic',
    fontWeight: '700',
};

const ExchangePolicy = () => {
    return (
        <div style={{lineHeight: '30px', padding:'2% 17%', fontFamily: '"Quicksand", sans-serif', color: '#grey', fontWeight: '500', textAlign: 'justify'}}>
            <header>
                <h2 style={{fontWeight: '700', lineHeight: '70px', color:'black'}}>Product Exchange and Warranty Policy</h2>
                <h3 style={{color:'#e67e22', textAlign:'center'}}>S T R E E T W E A R E A Z Y</h3>
                <section>
                    <h4 style={{color:'#e67e22'}}>A. PRODUCT EXCHANGE POLICY</h4>
                    <p style={Style}>1. Exchange period:</p>
                    <p>Within 05 days from the date of purchase (in-store) or the date of receipt (online purchase).</p>
                    <p>No returns and refunds accepted.</p>
                    <p style={Style}>2. Cases for product exchange:</p>
                    <ul style={{listStyle: 'none'}}>
                        <li>2.1 Customer request:</li>
                        <ul style={{listStyle: 'none'}}>
                            <li>Customer requests to change size.</li>
                            <li>Customer requests to exchange for another product, the price difference between the exchanged product and the new product will be calculated at the original price.</li>
                            <li>Shipping costs for exchange (both ways) are borne by the customer.</li>
                        </ul>
                        <li>2.2 Manufacturer's fault:</li>
                        <ul style={{listStyle: 'none'}}>
                            <li>Only accept exchanges in case of product defects due to the manufacturer (zipper, button, stitching, print...) or wrong product delivery, size change request.</li>
                            <li>Shipping costs for exchange (both ways) are borne by DOTAI.</li>
                        </ul>
                    </ul>
                    <p>*Note: Please check the product carefully and the exchange policy at DOTAI. It is mandatory to provide an unboxing video for verification. (If the video is not provided, the customer will have to pay one-way shipping costs).</p>
                    <p style={Style}>3. Exchange conditions:</p>
                    <p>The exchanged product must be unused, odorless, clean, not wrinkled, with original tags and any accompanying gifts (if any).</p>
                </section>
                <section>
                    <h4 style={{color:'#e67e22'}}>B. Product Warranty Policy:</h4>
                    <p style={Style}>1. Warranty period:</p>
                    <p>DOTAI provides a 3-month warranty for products with defects such as zipper, button, stitching, etc.</p>
                    <p style={Style}>2. Warranty processing time:</p>
                    <p>The time for DOTAI to process the product after warranty and return it to the customer will be 2-3 weeks after DOTAI receives the product from you, depending on the product condition.</p>
                    <p style={Style}>3. Warranty conditions:</p>
                    <p>Applicable to products: Clothing, accessories (excluding Underwear, socks...)</p>
                    <p style={Style}>4. Warranty is not applicable in the following cases:</p>
                    <ul style={{listStyle: 'none'}}>
                        <li>Damage due to improper use such as: overloading beyond the product's capacity, changing the product's shape significantly from its original form.</li>
                        <li>Damage due to improper storage such as: using strong detergents causing color fading, washing with other dark-colored products, prolonged sun exposure causing damage... ironing, drying at high temperatures.</li>
                        <li>Product damage due to external factors: insects, organisms, storage process.</li>
                        <li>Product damage due to external impact (collision, friction, strong rubbing) causing deformation, tearing, mold, burning, or user-caused damage.</li>
                        <li>Used products that are dirty, repaired by the user.</li>
                        <li>Products that are beyond the warranty period (3 months).</li>
                    </ul>
                    <p>During product use, if you have any questions, please contact us via Fanpage or hotline 0357 420 420 for quick support!</p>
                </section>
            </header>
        </div>
    );
};
export default ExchangePolicy;