Vue.component('VueCart', {
    props: {
        productcart: {type: Array, required: true},
        title: {type:String,required:true},
        type:{type:String, required:true},
        category: {type:Array,required:false}
    },
    methods:{
        removeFromCart(index){
            return  this.productcart.splice(index,1);
        },
       
        changeCart(index){
            const item = this.removeFromCart(index);
            this.$emit('itemchangeoncart',item[0], this.type);
        },

        filterCategory(categoryId){
            this.$emit('filtercategory',categoryId);
        }
      },

    computed: {
        cartTotal(){
            let total =0;
            this.productcart.forEach(item =>{
                total+=parseFloat(item.UnitPrice,10);
            });
            return total;
        },
        isShoppingCart(){
            return this.type == 'shoppingCart'
        },
        isSavedCart(){
            return this.type == 'savedCart'
        }
   },
 

    template: `
    <div class="cart-wrapper">
    
    <div class="row">
        <div class="mb-4 ml-3" v-for="item in category">
            <a class="btn btn-outline-success" v-on:click="filterCategory(item.CategoryID)">{{item.CategoryName}}</a>
        </div>
    </div>
    <div class="row">
         <div class="col">
             <h2>{{title}} ({{productcart.length}} item)</h2>
        </div>
        <div class="col">
            <h2 v-if="!productcart.length">No item in cart</h2>
        </div>
    </div>
    <div class="row">
        <div class="card m-4" v-for="(item,index) in productcart">
            <img class="card-img-top"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16fc72a8a15%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16fc72a8a15%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1953125%22%20y%3D%2296.3%22%3E286x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                alt="Card image cap">
            <div class="card-body">
                <h6 class="card-title bold">{{item.ProductName}}</h6>
                <p class="card-text">{{item.QuantityPerUnit}}</p>
                <p class="card-text">{{item.UnitPrice}} TL</p>
                <a href="#" class="btn btn-warning" v-on:click="removeFromCart(index)"  >Delete</a>
                <a href="#" class="btn btn-outline-info" v-on:click="changeCart(index)" v-if="isShoppingCart" >Save For Later</a>
                <a href="#" class="btn btn-outline-info" v-on:click="changeCart(index)" v-if="isSavedCart">Move to cart</a>
                </div>
        </div>

    </div>
    <hr />
    <div class="row " v-if="productcart.length">
        <a class="col float-right mb-4">
            SubTotal ({{productcart.length}} items : <span class="price">{{cartTotal}} TL</span>)
        </a>
    </div>
</div>
   
    `
});

window.addEventListener('load',()=>{
    window.vue = new Vue({
        el:'#app',
        data:{
            isLoading:true,
            dummyData: [],
            productcart:[],
            filters:[],
            categories:[],
            saved: [],
            
        },
        methods:{
        
            filter(categoryId){       
                this.productcart = [];      
                this.filters.forEach(item=>{
                    if(item.CategoryID === categoryId){                        
                        this.productcart.push(item)
                    }
                })
            }, 

            handleItemChange(item,cartType){
                if (cartType === 'shoppingCart'){
                    this.saved.push(item);
                }
                else{
                    this.productcart.push(item);
                }
            }
        },
      
        created(){
            
            fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Products?&$format=json')
            .then((res) => {return res.json() })
            .then((res) => {
                console.log(res)
            
              this.isLoading = false;
              this.productcart = res.value
              this.filters = res.value          
            })
        
            fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json')
            .then(res=>{ return res.json()})
            .then(res=>{
                console.log("categories")
                console.log(res.value);
                this.categories = res.value
            })
        },
        
    }) 
})