export const restExampleJson = {
  openapi: '3.0.1',
  info: {
    title: 'test',
    description: '',
    version: '1.0.0'
  },
  tags: [],
  paths: {
    '/v7/weather/now': {
      get: {
        summary: 'now',
        'x-apifox-folder': '',
        'x-apifox-status': 'developing',
        deprecated: false,
        description: '',
        tags: [],
        parameters: [
          {
            name: 'location',
            in: 'query',
            description: '',
            required: false,
            example: '101010100',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'key',
            in: 'query',
            description: '',
            required: false,
            example: '8f0808a9e5d447af9c8792070e5087b5',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: '成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'string'
                    },
                    updateTime: {
                      type: 'string'
                    },
                    fxLink: {
                      type: 'string'
                    },
                    now: {
                      type: 'object',
                      properties: {
                        obsTime: {
                          type: 'string'
                        },
                        temp: {
                          type: 'string'
                        },
                        feelsLike: {
                          type: 'string'
                        },
                        icon: {
                          type: 'string'
                        },
                        text: {
                          type: 'string'
                        },
                        wind360: {
                          type: 'string'
                        },
                        windDir: {
                          type: 'string'
                        },
                        windScale: {
                          type: 'string'
                        },
                        windSpeed: {
                          type: 'string'
                        },
                        humidity: {
                          type: 'string'
                        },
                        precip: {
                          type: 'string'
                        },
                        pressure: {
                          type: 'string'
                        },
                        vis: {
                          type: 'string'
                        },
                        cloud: {
                          type: 'string'
                        },
                        dew: {
                          type: 'string'
                        }
                      },
                      required: [
                        'obsTime',
                        'temp',
                        'feelsLike',
                        'icon',
                        'text',
                        'wind360',
                        'windDir',
                        'windScale',
                        'windSpeed',
                        'humidity',
                        'precip',
                        'pressure',
                        'vis',
                        'cloud',
                        'dew'
                      ],
                      'x-apifox-ignore-properties': [],
                      'x-apifox-orders': [
                        'obsTime',
                        'temp',
                        'feelsLike',
                        'icon',
                        'text',
                        'wind360',
                        'windDir',
                        'windScale',
                        'windSpeed',
                        'humidity',
                        'precip',
                        'pressure',
                        'vis',
                        'cloud',
                        'dew'
                      ]
                    },
                    refer: {
                      type: 'object',
                      properties: {
                        sources: {
                          type: 'array',
                          items: {
                            type: 'string'
                          }
                        },
                        license: {
                          type: 'array',
                          items: {
                            type: 'string'
                          }
                        }
                      },
                      required: ['sources', 'license'],
                      'x-apifox-ignore-properties': [],
                      'x-apifox-orders': ['sources', 'license']
                    }
                  },
                  required: ['code', 'updateTime', 'fxLink', 'now', 'refer'],
                  'x-apifox-ignore-properties': [],
                  'x-apifox-orders': ['code', 'updateTime', 'fxLink', 'now', 'refer']
                }
              }
            }
          }
        },
        "x-run-in-apifox'": 'https://www.apifox.cn/web/project/1824126/apis/api-49089650-run'
      }
    }
  },
  components: {
    schemas: {}
  },
  servers: [
    {
      url: 'https://devapi.qweather.com',
      description: 'weather'
    },
    {
      url: 'https://devapi.qweather.com1122222',
      description: 'weather'
    }
  ]
}
