async function checkToken (suppliedToken) {
  try {
    const allTokens = await strapi.query('api-tokens').findOne();
    if (allTokens) {
      const foundToken = allTokens.api_token.find(token => (`App ${token.token_key}` === suppliedToken));
      return foundToken ? true : false;
    } else {
      return false
    }
  } catch (e) {
    throw new Error('Error in token checking function:', e);
  }
}

module.exports = {

  getLatest: async ctx => {
    const item = ctx.request.body;
    try {
      // get all necessary items
      const aidRequests = await strapi.query('aid-request').find({ _limit: 20, _sort: 'id:desc', fulfilled: false })
      const aidCollections = await strapi.query('aid-collection').find({ _limit: 20, _sort: 'id:desc', fulfilled: false })
      const accommodations = await strapi.query('accommodation').find({ _limit: 20, _sort: 'id:desc', fulfilled: false })
      const transports = await strapi.query('transport').find({ _limit: 20, _sort: 'id:desc', fulfilled: false })
      const itemTags = await strapi.query('item-tag').find({ _limit: 20, _sort: 'tag' })
      // remove unwanted fields
      aidRequests.forEach(function(item){ delete item.created_by; delete item.updated_by });
      aidCollections.forEach(function(item){ delete item.created_by; delete item.updated_by });
      accommodations.forEach(function(item){ delete item.created_by; delete item.updated_by });
      transports.forEach(function(item){ delete item.created_by; delete item.updated_by });
      itemTags.forEach(function(item){ delete item.created_by; delete item.updated_by });
      // return
      ctx.send({
        'aidRequests': aidRequests,
        'aidCollections': aidCollections,
        'accommodations': accommodations,
        'transports': transports,
        'itemTags': itemTags,
      });
    } catch (e) {
      ctx.send({
        'aidRequests': [],
        'aidCollections': [],
        'accommodations': [],
        'transports': [],
        'itemTags': [],
      });
      throw new Error('Error in fetching compiled data for latest entries.', e);
    }
  },

  // new work, previous one to be removed upon finishing the big update push

  availableEntryCategories: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      
    } else {
      ctx.unauthorized(`No valid token!`);
    }

    try {
      // fetch data
      const availableEntryCategories = await strapi.query('entry-category').find({ _sort: 'id:asc', available_in_public_menu: true });
      // remove unwanted data
      availableEntryCategories.forEach(function(item){ delete item.created_by; delete item.updated_by });
      // return
      ctx.send({
        'availableEntryCategories': availableEntryCategories,
      });
    } catch (e) {
      ctx.send({
        'availableEntryCategories': [],
      });
      throw new Error('Error in fetching entry categories:', e);
    }
  },

  availableEntries: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      
    } else {
      ctx.unauthorized(`No valid token!`);
    }
    try {
      // fetch data from DB
      const entries = await strapi.query('entry').find({ _sort: 'id:desc' });
      // remove unwanted data
      entries.forEach(function(item){ delete item.created_by; delete item.updated_by });
      // return
      ctx.send({
        'entries': entries,
      });
    } catch (e) {
      ctx.send({
        'entries': [],
      });
      throw new Error('Error in fetching all entries:', e);
    }
  },

  latestEntries: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      try {
        // fetch data from DB
        const entries = await strapi.query('entry').find({ _limit: 20, _sort: 'id:desc', done: false });
        const itemTags = await strapi.query('item-tag').find({ _sort: 'tag' });
        const availableEntryCategories = await strapi.query('entry-category').find({ _sort: 'id:asc', available_in_public_menu: true });
        const publicSiteSettings = await strapi.query('public-site-settings').find();
        // remove unwanted data
        entries.forEach(function(item){ delete item.created_by; delete item.updated_by });
        itemTags.forEach(function(item){ delete item.created_by; delete item.updated_by });
        availableEntryCategories.forEach(function(item){ delete item.created_by; delete item.updated_by });
        publicSiteSettings.forEach(function(item){ delete item.created_by; delete item.updated_by });
        // return
        ctx.send({
          'entries': entries,
          'itemTags': itemTags,
          'availableEntryCategories': availableEntryCategories,
          'publicSiteSettings': publicSiteSettings,
        });
      } catch (e) {
        ctx.send({
          'entries': [],
          'itemTags': [],
          'availableEntryCategories': [],
          'publicSiteSettings': null,
        });
        throw new Error('Error in fetching compiled data for latest entries:', e);
      }
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  },

  allEntriesInCategory: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      const requestCategorySlug = ctx.params.slug;

      try {
        // fetch data from DB
        const entries = await strapi.query('entry').find({ _sort: 'id:desc', 'entry_category.type_slug': requestCategorySlug, done: false });
        const itemTags = await strapi.query('item-tag').find({ _sort: 'tag' });
        const availableEntryCategories = await strapi.query('entry-category').find({ _sort: 'id:asc', available_in_public_menu: true });
        const publicSiteSettings = await strapi.query('public-site-settings').find();
        // remove unwanted data
        entries.forEach(function(item){ delete item.created_by; delete item.updated_by });
        itemTags.forEach(function(item){ delete item.created_by; delete item.updated_by });
        availableEntryCategories.forEach(function(item){ delete item.created_by; delete item.updated_by });
        publicSiteSettings.forEach(function(item){ delete item.created_by; delete item.updated_by });
        // return
        ctx.send({
          'entries': entries,
          'itemTags': itemTags,
          'availableEntryCategories': availableEntryCategories,
          'publicSiteSettings': publicSiteSettings,
        });
      } catch (e) {
        ctx.send({
          'entries': [],
          'itemTags': [],
          'availableEntryCategories': [],
          'publicSiteSettings': null,
        });
        throw new Error('Error in fetching compiled data for category entries:', e);
      } 
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  },

  entriesSearch: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      const searchTerm = ctx.params.term;

      try {
        // fetch data from DB
        const entries = await strapi.query('entry').search({ _sort: 'id:desc', _q: searchTerm, done: false });
        const itemTags = await strapi.query('item-tag').find({ _sort: 'tag' });
        const availableEntryCategories = await strapi.query('entry-category').find({ _sort: 'id:asc', available_in_public_menu: true });
        const publicSiteSettings = await strapi.query('public-site-settings').find();
        // remove unwanted data
        entries.forEach(function(item){ delete item.created_by; delete item.updated_by });
        itemTags.forEach(function(item){ delete item.created_by; delete item.updated_by });
        availableEntryCategories.forEach(function(item){ delete item.created_by; delete item.updated_by });
        publicSiteSettings.forEach(function(item){ delete item.created_by; delete item.updated_by });
        // return
        ctx.send({
          'entries': entries,
          'itemTags': itemTags,
          'availableEntryCategories': availableEntryCategories,
          'publicSiteSettings': publicSiteSettings,
        });
      } catch (e) {
        ctx.send({
          'entries': [],
          'itemTags': [],
          'availableEntryCategories': [],
          'publicSiteSettings': null,
        });
        throw new Error('Error in fetching compiled data for entries search:', e);
      } 
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  },

  entriesSearchByAssignedVolunteer: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      const searchTerm = ctx.params.volunteer;

      try {
        // fetch data from DB
        const entries = await strapi.query('entry').find({ _sort: 'id:desc', volunteer_assigned_contains: searchTerm, done: false });
        const itemTags = await strapi.query('item-tag').find({ _sort: 'tag' });
        const availableEntryCategories = await strapi.query('entry-category').find({ _sort: 'id:asc', available_in_public_menu: true });
        const publicSiteSettings = await strapi.query('public-site-settings').find();
        // remove unwanted data
        entries.forEach(function(item){ delete item.created_by; delete item.updated_by });
        itemTags.forEach(function(item){ delete item.created_by; delete item.updated_by });
        availableEntryCategories.forEach(function(item){ delete item.created_by; delete item.updated_by });
        publicSiteSettings.forEach(function(item){ delete item.created_by; delete item.updated_by });
        // return
        ctx.send({
          'entries': entries,
          'itemTags': itemTags,
          'availableEntryCategories': availableEntryCategories,
          'publicSiteSettings': publicSiteSettings,
        });
      } catch (e) {
        ctx.send({
          'entries': [],
          'itemTags': [],
          'availableEntryCategories': [],
          'publicSiteSettings': null,
        });
        throw new Error('Error in fetching compiled data for entries search:', e);
      } 
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  },

  singleEntry: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      const entryId = ctx.params.id;
      try {
        // fetch data from DB
        const entry = await strapi.query('entry').findOne({ id: entryId });
        const itemTags = await strapi.query('item-tag').find({ _sort: 'tag' });
        const availableEntryCategories = await strapi.query('entry-category').find({ _sort: 'id:asc', available_in_public_menu: true });
        const publicSiteSettings = await strapi.query('public-site-settings').find();
        // remove unwanted data
        delete entry.created_by;
        delete entry.updated_by;
        itemTags.forEach(function(item){ delete item.created_by; delete item.updated_by });
        availableEntryCategories.forEach(function(item){ delete item.created_by; delete item.updated_by });
        publicSiteSettings.forEach(function(item){ delete item.created_by; delete item.updated_by });
        // return
        ctx.send({
          'entry': entry,
          'itemTags': itemTags,
          'availableEntryCategories': availableEntryCategories,
          'publicSiteSettings': publicSiteSettings,
        });
      } catch (e) {
        ctx.send({
          'entry': [],
          'itemTags': [],
          'availableEntryCategories': [],
          'publicSiteSettings': null,
        });
        throw new Error('Error in fetching compiled data for a single entry:', e);
      }
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  },

  addEntry: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      const data = ctx.request.body;
      const requiredFields = data.title && data.description && data.location && data.contact_name && data.contact_phone && data.tags;
      if (requiredFields) {
        try {
          const newEntry = await strapi.query('entry').create(data);
          ctx.send(newEntry)
        } catch (e) {
          ctx.send({
            'result': 'error',  
          })
          throw new Error('Error in adding an entry:', e);
        }
      } else {
        ctx.notFound(`Please submit all required data: title, description, location, contact name, contact phone, and tags.`);
      }
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  },

  addCommentToEntry: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      const data = ctx.request.body;
      try {
        const newComment = await strapi.query('comment').create({
          author: data.comment.author,
          content: data.comment.content,
        })
        const entry = await strapi.query('entry').findOne({ id: data.entryId });
        const newEntryComments = entry.comments;
        newEntryComments.push(newComment);
        const updatedEntry = await strapi.query('entry').update({ id: data.entryId }, {
          comments: newEntryComments
        })
        ctx.send({
          'result': updatedEntry,  
        })
      } catch (e) {
        ctx.send({
          'result': 'error',  
        })
        throw new Error('Error in adding an entry comment:', e);
      } 
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  },

  setVolunteerAssignmentToEntry: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      const data = ctx.request.body;
      try {
        const updatedEntry = await strapi.query('entry').update({ id: data.entryId }, {
          volunteer_assigned: data.volunteer_assigned,
        })
        ctx.send({
          'result': 'success'
        })
      } catch (e) {
        ctx.send({
          'result': 'error'
        })
        throw new Error('Error in setting volunteer assignment:', e);
      }
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  },

  setVolunteerMarkedEntryDone: async ctx => {

    const tokenValid = await checkToken(ctx.request.header.authorization);
    if (tokenValid) {
      const data = ctx.request.body;
      try {
        const updatedEntry = await strapi.query('entry').update({ id: data.entryId }, {
          notes: data.notes,
          volunteer_marked_as_done: data.volunteer_marked_as_done
        })
        ctx.send({
          'result': 'success'
        })
      } catch (e) {
        ctx.send({
          'result': 'error'
        })
        throw new Error('Error in setting volunteer assignment:', e);
      } 
    } else {
      ctx.unauthorized(`No valid token!`);
    }
  }
}