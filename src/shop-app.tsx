import * as React from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "./components/button";
import ProductList from "./components/product-list-components";
import { Form } from "./components/form";
import styles from "./shopApp.module.css";
import {Header} from "./components/header";

export class ShopApp extends React.Component<
  {},
  { products: any[]; isOpen: boolean; isShowingMessage: boolean; message: string; numFavorites: number; prodCount: number }
> {
    //API url should be stored in env to handle local, dev, staging and live environment.
    readonly apiUrl: string = 'https://fakestoreapi.com/products';
  constructor(props: any) {
    super(props);

    this.favClick = this.favClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = { products: [], isOpen: false, isShowingMessage: false, message: '', numFavorites: 0, prodCount: 0 };

  }

   componentDidMount(){
      //It will fetch and add products. We don't need to catch this promise
      this.getProducts();
      document.title = "Droppe refactor app"
   }

    /**
     * This function will fetch products from API
     */
    getProducts(){
       //This API url should be stored in env
       let apiUrl = this.apiUrl;
       fetch(apiUrl).then((response) => {
           response.json().then((data) => {
               this.setState({
                   products: data,
                   prodCount: data.length
               })
           });
       }).catch(e=>{
           this.setMessage("Product API connectivity issue .....")
       });
   }

  favClick( index: number) {
    let {numFavorites, products} = this.state;
    let product =  products[index];
      product.isFavorite=!product.isFavorite;
      product.isFavorite?numFavorites++:numFavorites--;

    this.setState({ products, numFavorites });
  }

  onSubmit(payload: { title: string; description: string, price: string }) {
    let {title,description,price}=payload;
    const products = this.state.products;
    let product={title,description,price}
    this.closeModal();
    this.setMessage('Adding product...')
    //This API url should be stored in env
    let apiUrl = this.apiUrl;

    // **this POST request doesn't actually post anything to any database**
    fetch(apiUrl,{
            method:"POST",
            body:JSON.stringify(product)
        })
            .then(res=>res.json())
            .then(json => {
                //:todo First we need to validate the data is stored by checking json response before adding actual data into dom.
                products.push(product);
                this.setState({
                    products: products,
                    prodCount: products.length
                });
                this.hideMessage();
            }).catch(e=>{this.setMessage("Unable to save the product.")})
  }

    /**
     * Hide message after a certain time
     * @param time
     */
  hideMessage(time:number=2000){
      setTimeout(()=>{
          this.setState({
              isShowingMessage: false,
              message: ''
          })
      },time)
  }

    /**
     * This function is for showing message by taking message param.
     * @param message
     */
  setMessage(message:string ="" ){
      this.setState({
          isShowingMessage: Boolean(message.length),
          message: message
      })
  }

    /**
     * It will open Modal
     */
  openModal(){
    this.setState({
        isOpen: true,
    });

    }

    /**
     * It will close Modal
     */
  closeModal(){
    this.setState({
        isOpen: false,
    });

    }
  render() {
    const { products, isOpen } = this.state;
    return (
      <>
        <Header />
        //:todo body should be move to a separate component for scalability, readability and usability
        //:todo Move product click and all other logic to the body component
        <div className={['container', styles.main].join(' ')} style={{paddingTop: 0}}>
          <div className={styles.buttonWrapper}>
            <span role="button">
               <Button
                  onClick={this.openModal}
               >Send product proposal</Button>
            </span>
             {this.state.isShowingMessage && <div className={styles.messageContainer}>
                <i>{this.state.message}</i>
             </div>}
          </div>

          <div className={styles.statsContainer}>
            <span>Total products: {this.state.prodCount}</span>
            {' - '}
            <span>Number of favorites: {this.state.numFavorites}</span>
          </div>

          {products && !!products.length ? <ProductList products={products} onFav={this.favClick} /> : <div></div>}
        </div>


       <Modal
          isOpen={isOpen}
          className={styles.reactModalContent}
          overlayClassName={styles.reactModalOverlay}
       >
          <div className={styles.modalContentHelper}>
             <div
                className={styles.modalClose}
                onClick={this.closeModal}
             ><FaTimes /></div>

             <Form
                on-submit={this.onSubmit}
             />
          </div>
       </Modal>

      </>
    );
  }
}
