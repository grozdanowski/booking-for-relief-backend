module.exports = {

  getLatest: async ctx => {
    const item = ctx.request.body;
    try {
      const aidRequests = await strapi.query('aid-request').find({ _limit: 20, _sort: 'id:desc', fulfilled: false })
      const aidCollections = await strapi.query('aid-collection').find({ _limit: 20, _sort: 'id:desc', fulfilled: false })
      const accommodations = await strapi.query('accommodation').find({ _limit: 20, _sort: 'id:desc', fulfilled: false })
      const transports = await strapi.query('transport').find({ _limit: 20, _sort: 'id:desc', fulfilled: false })
      const itemTags = await strapi.query('item-tag').find({ _limit: 20, _sort: 'tag' })
      aidRequests.forEach(function(item){ delete item.created_by; delete item.updated_by });
      aidCollections.forEach(function(item){ delete item.created_by; delete item.updated_by });
      accommodations.forEach(function(item){ delete item.created_by; delete item.updated_by });
      transports.forEach(function(item){ delete item.created_by; delete item.updated_by });
      itemTags.forEach(function(item){ delete item.created_by; delete item.updated_by });
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
  }
}