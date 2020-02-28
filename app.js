const bodyParser    = require("body-parser"),
expressSanitizer    = require("express-sanitizer"),
methodOverride      = require("method-override"),
express             = require("express"),
mongoose            = require("mongoose"),
app                 = express()

//kuch bhi shi nhi chl rha new page, update nhi ho rha, sirf delete shi chl rha h

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
/* blog.create(
    {
        title: "Thailand: Locked at a Hostels Bathroom And Rescued By a Thai Man",
        image: "https://hostelgeeks.com/wp-content/uploads/2014/12/locked-bathroom-hostel.jpg",
        body: "The day started out like any other, perhaps lazier. We stayed at a hostel in Phuket, Thailand (all 5 Star Hostels in Thailand), and we had to check out at 12. At around 11am we decided to get showered.  I stripped off outside the wet room and closed the door behind me. Next thing I knew I was standing in the bathroom with a doorknob in my hand. Caroline heard the noise and asked what was happening. We laughed until she tried the handle on her side. Nothing. We utilized our cutlery like locksmiths hoping to crack it. I stood stark naked, not a towel in the room, asking Caroline to fetch help. I thought this only happened in movies! She returned with a member of staff and I was staring down the possibility of a Thai man opening the door on me in all my glory like some sort of flashing nutcase! Whilst he hunted for tools I asked Caroline to post me my pants. I jumped into them as the guy returned to attack the lock again. He cracked it revealing me wearing nothing but my boxers and a grin. The guy did not know where to look. He ran and we still managed to shower, pack and check out before 12 o’clock."
        }, function(err,blog){
        if(err){
            console.log(err);
        }
        else{
            console.log(blog);
        }
    }
); */ 

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
    req.body.blog.body = req.sanitize(req.body.blog.body); //middleware allow it to sanitize before create route also
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