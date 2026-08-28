export default {
    name:'workExperience',
    title:'Work Experience',
    type:'document',
    fields:[
           {name:'name',
               title:'name',
               type:'string'
            },
            {
                name:'company',
                title:'Company',
                type:'string'
            },
            {
                name:'desc',
                title:'Desc',
                type:'string'
            },
            {
                name: 'startDate',
                title: 'startDate',
                type: 'date'
            },
            {
                name: 'endDate',
                title: 'endDate',
                type: 'date'
            },
            {
                name:'companyLogo',
                title:'companyLogo',
                type: 'image',
                options: {
                  hotspot: true,
                },
            },
            {
                name: 'tags',
                title: 'tags',
                type: 'array',
                of: [{ type: 'skills' }]
            }
    ]
}