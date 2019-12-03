const filter = (model, populate) => async (req, res, next) => {

    let query;

    //Copy req.query
    const reqQuery = {
        ...req.query
    }
    //Fileds to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators ($gt,$gte, etc.) 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //finding resource
    query = model.find(JSON.parse(queryStr));

    //select
    if (req.query.select) {

        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    // //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    } else {
        // '-createdAt' reverse sort by Date,  'createdAt' sort by Date
        query = query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    //executing our query
    const results = await query;

    //Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.filter = {
        succes: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
}

module.exports = filter;