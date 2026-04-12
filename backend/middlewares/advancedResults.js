const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    const pagination = {};
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let searchObj = JSON.parse(queryStr);
    
    if (req.query.search) {
        searchObj.title = { $regex: req.query.search, $options: 'i' }; 
    }

    query = model.find(searchObj);

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    if (populate) {
        query = query.populate(populate);
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(searchObj);

    query = query.skip(startIndex).limit(limit);

    const results = await query;

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        totalCount: total,
        pagination,
        data: results,
    };

    next();
};

module.exports = advancedResults;