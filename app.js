const bodyParser    = require("body-parser"),
expressSanitizer    = require("express-sanitizer"),
methodOverride      = require("method-override"),
express             = require("express"),
mongoose            = require("mongoose"),
app                 = express()

//APP config
mongoose.connect('mongodb://localhost:27017/Blog', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //it should be after body parser
app.use(methodOverride("_method"))
app.use(express.static("public"));
app.set("view engine","ejs");

//MONGOOSE config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const blog = mongoose.model("blog",blogSchema);

//RESTful routes
app.listen(3000,function(req,res){
    console.log("We are on port: 3000 - Blogs");
});

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    blog.find({},function(err,blog){
        if(err) console.log(err);
        else res.render("index",{blog: blog});
    })
})

app.get("/blogs/:id",function(req,res){
    //find blog with provided id
    blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{blog: blog});
        }
    });
})

app.get("/blogs/new",function(req,res){
    res.render("new");
});

//create new blog
app.post("/blogs",function(req,res){
    blog.create(req.body.blog,function(err,newblog){
        if(err) {
            res.render("new");
        }
        else {
            console.log(newblog);
            res.redirect("/blogs");
        }
    });
});

//edit data
app.get("/blogs/:id/edit", function(req,res){
    blog.findById(req.params.id, function(err,editBlog){
        if(err){
            res.redirect("/blog");
            alert(err);
        }
        else{
            res.render("edit",{blog: editBlog});
        }
    })
})

//update data
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body); //middleware allows it to sanitize before create route also
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,blog){
        if(err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})
//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
 });
