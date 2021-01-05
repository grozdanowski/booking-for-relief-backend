const findLatLonData = (values, requestedValue) => {
  let value = null;
  Object.keys(values).forEach((key) => {
    if ((Array.isArray(values[key])) && (values[key][0][requestedValue])) {
      value = values[key][0][requestedValue];
    }
  })
  return value;
}

module.exports = {

  create: async ctx => {
    const item = ctx.request.body;
    if (item.values) {
      const newData = {
        'locationLat': findLatLonData(item.values, 'lat'),
        'locationLon': findLatLonData(item.values, 'lon'),
        'location': item.title,
        'description': item.content,
        'notes': `URL na izvorni item na Potres2020: https://potres2020.openit.hr/posts/${item.id}     Dodatni info iz Potres2020: ${item.values['3c8441b3-5744-48bb-9d9e-d6ec4be50613']}`,
        'contact_name': item.values['4583d2a1-331a-4da2-86df-3391e152198e'] ? item.values['4583d2a1-331a-4da2-86df-3391e152198e'][0] : '',
        'contact_phone': item.values['1328cf24-09de-44cd-b159-6242e6165530'] ? item.values['1328cf24-09de-44cd-b159-6242e6165530'][0] : '',
        'submitter_email': 'potres@2020.hr',
        'available_on_whatsapp': false,
        'fulfilled': false,
        'original_app_id': item.id,
      }
      console.log(newData);
      const formId = item.form ? item.form.id : item.form_id;
      switch (formId) {
        case 5:
          endpoint = 'accommodation'
          break;
        case 13:
          endpoint = 'aid-collection'
          break;
        default:
          endpoint = 'aid-request'
          break;
      }
      try {
        await strapi.query(endpoint).create(newData)
      } catch (e) {
        throw new Error('Unable to add the entry.');
      }
      console.log('Novi entry dodan!');
      ctx.send('Entry dodan!');
    } else {
      ctx.badRequest('Received data not valid.');
      ctx.send({});
    }
  },

  createGet: async ctx => {
    ctx.send('No GET functionality on this API.');
  },

  markDone: async ctx => {
    const item = ctx.request.body;
    const timeNow = new Date();
    console.log(`Received an event about a change in ${item.id}.`)
    if (item.values && (item.status === 'archived')) {
      console.log(`Item archived. Proceeding to sync.`)
      const formId = item.form ? item.form.id : item.form_id;
      switch (formId) {
        case 5:
          endpoint = 'accommodation'
          break;
        case 13:
          endpoint = 'aid-collection'
          break;
        default:
          endpoint = 'aid-request'
          break;
      }
      try {
        const existingResult = await strapi.query(endpoint).findOne({ original_app_id: item.id });
        if (existingResult) {
          console.log(`Found item in current system. Item id: ${existingResult.id}, in ${endpoint}.`)
          try {
            await strapi.query(endpoint).update(
              { id: existingResult.id },
              {
                fulfilled: true,
                notes: existingResult.notes ? `${existingResult.notes} \n Potres2020 arhivirano: ${timeNow}` : ``
              }
            )
          } catch (e) {
            throw new Error('Unable to edit the entry.');
          }
          ctx.send({});
        } else {
          ctx.notFound('Received event not found.');
          ctx.send({});
        }
      } catch (e) {
        throw new Error('Unable to edit the entry.');
      }
      ctx.send({});
    } else {
      ctx.badRequest('Received data not valid or not archived.');
      ctx.send({});
    }
  },

  test: async ctx => {
    ctx.send('Testiram!');
  }
}