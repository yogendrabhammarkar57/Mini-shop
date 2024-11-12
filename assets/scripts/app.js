class Product {
    constructor(title,img,price,desc){
        this.title = title;
        this.imgUrl = img;
        this.price = price;
        this.description = desc; 
    }
};

class ElementAttribute{
    constructor(attName,attrValue){
        this.name = attName;
        this.value = attrValue;
    }
};

class Component{
    constructor(renderHookId){
        this.hookId = renderHookId;
    }
    createRootElement(tags,cssClasses,attributes){
        const rootElement = document.createElement(tags);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }
        if (attributes && attributes.length > 0) {
            for (const element of attributes) {
                rootElement.setAttribute(element.name,element.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component{
    items = [];
    set cartItems(value){
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmt.toFixed(2)} </h2>`
    }
    get totalAmt(){
        const sum = this.items.reduce((pre ,cur) => pre + cur.price,0);
        return sum;
    }
    constructor(renderHookId){
        super(renderHookId,false);
        this.orderProducts=()=>{
            console.log("Ordering....");
            console.log(this.items);
        };
    }
    addProduct(product){
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;

    }
    
    render(){
        const cartEl = this.createRootElement('section','cart');
        cartEl.innerHTML = `
        <h2>Total: \$${0} </h2>
        <button>Order now</button>
            `;
        this.totalOutput = cartEl.querySelector('h2');
        const orderButton = cartEl.querySelector('button');
        orderButton.addEventListener('click',this.orderProducts)
    }

}
class ProductItem extends Component{
    constructor(product,renderHookId){
        super(renderHookId);
        this.product = product;
    }
    addToCart(){
        App.addProductToCart(this.product);
    }
    
    render(){
        const prodEl = this.createRootElement('li','product-item');
            prodEl.innerHTML =
                `
                <div>
                <img src="${this.product.imgUrl}" alt="${this.product.title}">
                    <div class="product-item__content">
                        <h2>${this.product.title}</h2>
                        <h3>\$${this.product.price}</h3>
                        <h4>${this.product.description}</h4>
                        <button>Add to cart</button>
                    </div>
                </div>
                `;
                const addCartButton = prodEl.querySelector('button');
                addCartButton.addEventListener('click', this.addToCart.bind(this));
    }
}

class ProductList extends Component{
    products = [
        new Product(
            'A pilow',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQubz4k9mohn0_tluLRwJ73na8mg8UI2t4OwQ&s',
            19.99,
            'a soft pillow',
        ),
        new Product(
            'A carpet',
            'https://cdn.britannica.com/45/7945-050-89A5E274/silk-carpet-Persian-Kashan-Iran-field-medallion.jpg',
            199.99,
            'a soft carpet',
        ),
    ];
    constructor(renderHookId){
        super(renderHookId);
    }
    render(){
        this.createRootElement('ul','product-list',[new ElementAttribute('id','prod-list')]);
        for (const element of this.products) {
            const prodItem = new ProductItem(element,'prod-list');
            prodItem.render();
        }
    }
}

class Shop{
    render(){
        this.cart = new ShoppingCart('app');
        this.cart.render();
        const productList = new ProductList('app');
        productList.render();
    }
}
class App{
    static init(){
        const shop = new Shop();
        shop.render();
        this.cart = shop.cart;
    }
    static addProductToCart(product){
        this.cart.addProduct(product);
    }
}
App.init();