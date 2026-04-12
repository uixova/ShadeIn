const mongoose = require('mongoose');
const slugify = require('slugify');

const categories = ["Software", "Tech", "Design", "AI", "Frontend", "Backend", "Mobile", "Cybersecurity", "Cloud", "Web3", "Game Dev", "Tutorials"];

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title'], 
        unique: true,
        trim: true,
        maxlength: [50, 'Title cannot be longer than 50 charactersz'],
        minlength: [3, 'The title must be at least 3 characters']
    },
    slug: String,
    content: {
        type: String,
        required: [true, 'Please enter the blog content'],
        minlength: [20, 'Blog content must be at least 20 characters']
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'archived'],
            message: '{VALUE} is not a valid status. Use: draft, published, archived'
        },
        default: 'draft'
    },
    category: {
        type: String,
        enum: categories,
        default: 'Tech'
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

blogSchema.pre('save', function() {
    this.updatedAt = Date.now();
    this.slug = slugify(this.title, { lower: true });
});

blogSchema.virtual('fullTitle').get(function() {
    return `[${this.category}] ${this.title}`;
});

module.exports = mongoose.model('Blog', blogSchema);