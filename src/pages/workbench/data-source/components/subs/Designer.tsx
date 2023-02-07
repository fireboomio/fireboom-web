import { Input, message, Modal } from 'antd'
import axios from 'axios'
import { omit } from 'lodash'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import requests, { getHeader } from '@/lib/fetchers'

import iconAli from '../assets/ali.svg'
import iconCockroachDB from '../assets/CockroachDB.svg'
import iconFaas from '../assets/Faas.svg'
import iconGraphalAPI from '../assets/GraphalAPI.svg'
import iconMariaDB from '../assets/MariaDB.svg'
import iconMongoDB from '../assets/MongoDB.svg'
import iconMySQL from '../assets/MySQL.svg'
import iconNode from '../assets/node.js.svg'
import iconPlanetscale from '../assets/Planetscale.svg'
import iconPostgreSQL from '../assets/PostgreSQL.svg'
import iconRabbitMQ from '../assets/RabbitMQ.svg'
import iconRESTAPI from '../assets/RESTAPI.svg'
import iconRocketMQ from '../assets/RocketMQ.svg'
import iconSQLite from '../assets/SQLite.svg'
import iconSQLServer from '../assets/SQLServer.svg'
import styles from './Designer.module.less'

export default function Designer() {
  const intl = useIntl()
  const initData = useMemo<
    {
      name: string
      items: {
        name: string
        logo?: string
        icon: string
        sourceType?: number
        dbType?: string
        coming?: boolean
      }[]
    }[]
  >(
    () => [
      {
        name: 'API',
        items: [
          { name: 'REST API', icon: iconRESTAPI, sourceType: 2 },
          { name: 'GraphQL API', icon: iconGraphalAPI, sourceType: 3 }
        ]
      },
      {
        name: intl.formatMessage({ defaultMessage: '数据库' }),
        items: [
          {
            name: 'PostgreSQL',
            icon: iconPostgreSQL,
            sourceType: 1,
            dbType: 'PostgreSQL',
            coming: true
          },
          { name: 'MySQL', icon: iconMySQL, sourceType: 1, dbType: 'MySQL' },
          { name: 'MongoDB', icon: iconMongoDB, sourceType: 1, dbType: 'MongoDB', coming: true },
          { name: 'Sqlite', icon: iconSQLite, sourceType: 1, dbType: 'SQLite', coming: true },
          {
            name: 'CockroachDB',
            icon: iconCockroachDB,
            sourceType: 1,
            dbType: 'CockroachDB',
            coming: true
          },
          {
            name: 'SQL Server',
            icon: iconSQLServer,
            sourceType: 1,
            dbType: 'SQL Server',
            coming: true
          },
          {
            name: 'Plantscale',
            icon: iconPlanetscale,
            sourceType: 1,
            dbType: 'Plantscale',
            coming: true
          },
          {
            name: 'MariaDB',
            icon: iconMariaDB,
            sourceType: 1,
            dbType: 'MariaDB',
            coming: true
          }
        ]
      },
      {
        name: intl.formatMessage({ defaultMessage: '消息队列' }),
        items: [
          { name: 'RabbitMQ', icon: iconRabbitMQ, coming: true },
          { name: 'RocketMQ', icon: iconRocketMQ, coming: true },
          {
            name: intl.formatMessage({ defaultMessage: '阿里云物联网平台' }),
            icon: iconAli,
            coming: true
          }
        ]
      },
      {
        name: intl.formatMessage({ defaultMessage: '自定义' }),
        items: [
          { name: 'node.js', icon: iconNode, sourceType: 4 },
          { name: 'Faas', icon: iconFaas, sourceType: 4, coming: true }
        ]
      }
    ],
    [intl]
  )
  // 解析图标
  const iconMap = useMemo<Record<string, string>>(() => {
    const iconMap: Record<string, string> = {}
    initData.forEach(({ items }) => {
      items.forEach(({ sourceType, dbType, icon }) => {
        iconMap[`${sourceType}_${dbType ?? ''}`.toLowerCase()] = icon
      })
    })
    return iconMap
  }, [initData])
  const dispatch = useContext(DatasourceDispatchContext)
  const { handleToggleDesigner, handleCreate, handleSave } = useContext(DatasourceToggleContext)
  const [data, setData] = useState(initData)
  const [examples, setExamples] = useState([])
  const inputValue = useRef<string>('')

  useEffect(() => {
    const exampleList = [
      {
        coming: true,
        name: 'example_pgsql',
        sourceType: 1,
        config: {
          apiNamespace: 'example_pgsql',
          dbType: 'postgresql',
          appendType: '0',
          databaseUrl: {
            key: '',
            kind: '0',
            val: 'anson:1234qwer!@139.196.89.94:5433/dbc32d0e6ba2c141c196fe42bb389034b8anson'
          },
          schemaExtension: '',
          replaceJSONTypeFieldConfiguration: null,
          host: '',
          dbName: '',
          port: '',
          userName: {
            key: '',
            kind: '',
            val: ''
          },
          password: {
            key: '',
            kind: '',
            val: ''
          }
        },
        switch: 0,
        createTime: '',
        updateTime: '',
        isDel: 0
      },
      {
        name: 'example_restApi',
        sourceType: 2,
        config: {
          apiNameSpace: 'example_restApi',
          filePath: 'example_rest.json',
          baseURL: '',
          jwtType: '',
          secret: {
            key: '',
            kind: '',
            val: ''
          },
          signingMethod: '',
          tokenPoint: '',
          statusCodeUnions: false,
          headers: []
        },
        switch: 0,
        createTime: '',
        updateTime: '',
        isDel: 0,
        onSelect: () => {
          const json = `openapi: 3.0.3
info:
  title: Swagger Petstore - OpenAPI 3.0
  description: |-
    This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about
    Swagger at [https://swagger.io](https://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!
    You can now help us improve the API whether it's by making changes to the definition itself or to the code.
    That way, with time, we can improve the API in general, and expose some of the new features in OAS3.

    _If you're looking for the Swagger 2.0/OAS 2.0 version of Petstore, then click [here](https://editor.swagger.io/?url=https://petstore.swagger.io/v2/swagger.yaml). Alternatively, you can load via the \`Edit > Load Petstore OAS 2.0\` menu option!_
    
    Some useful links:
    - [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
    - [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
  termsOfService: http://swagger.io/terms/
  contact:
    email: apiteam@swagger.io
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
  version: 1.0.11
externalDocs:
  description: Find out more about Swagger
  url: http://swagger.io
servers:
  - url: https://petstore3.swagger.io/api/v3
tags:
  - name: pet
    description: Everything about your Pets
    externalDocs:
      description: Find out more
      url: http://swagger.io
  - name: store
    description: Access to Petstore orders
    externalDocs:
      description: Find out more about our store
      url: http://swagger.io
  - name: user
    description: Operations about user
paths:
  /pet:
    put:
      tags:
        - pet
      summary: Update an existing pet
      description: Update an existing pet by Id
      operationId: updatePet
      requestBody:
        description: Update an existent pet in the store
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
          application/xml:
            schema:
              $ref: '#/components/schemas/Pet'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Pet'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'          
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
        '405':
          description: Validation exception
      security:
        - petstore_auth:
            - write:pets
            - read:pets
    post:
      tags:
        - pet
      summary: Add a new pet to the store
      description: Add a new pet to the store
      operationId: addPet
      requestBody:
        description: Create a new pet in the store
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
          application/xml:
            schema:
              $ref: '#/components/schemas/Pet'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Pet'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'          
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        '405':
          description: Invalid input
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /pet/findByStatus:
    get:
      tags:
        - pet
      summary: Finds Pets by status
      description: Multiple status values can be provided with comma separated strings
      operationId: findPetsByStatus
      parameters:
        - name: status
          in: query
          description: Status values that need to be considered for filter
          required: false
          explode: true
          schema:
            type: string
            default: available
            enum:
              - available
              - pending
              - sold
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'          
            application/xml:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid status value
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /pet/findByTags:
    get:
      tags:
        - pet
      summary: Finds Pets by tags
      description: Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
      operationId: findPetsByTags
      parameters:
        - name: tags
          in: query
          description: Tags to filter by
          required: false
          explode: true
          schema:
            type: array
            items:
              type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'          
            application/xml:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid tag value
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /pet/{petId}:
    get:
      tags:
        - pet
      summary: Find pet by ID
      description: Returns a single pet
      operationId: getPetById
      parameters:
        - name: petId
          in: path
          description: ID of pet to return
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'          
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
      security:
        - api_key: []
        - petstore_auth:
            - write:pets
            - read:pets
    post:
      tags:
        - pet
      summary: Updates a pet in the store with form data
      description: ''
      operationId: updatePetWithForm
      parameters:
        - name: petId
          in: path
          description: ID of pet that needs to be updated
          required: true
          schema:
            type: integer
            format: int64
        - name: name
          in: query
          description: Name of pet that needs to be updated
          schema:
            type: string
        - name: status
          in: query
          description: Status of pet that needs to be updated
          schema:
            type: string
      responses:
        '405':
          description: Invalid input
      security:
        - petstore_auth:
            - write:pets
            - read:pets
    delete:
      tags:
        - pet
      summary: Deletes a pet
      description: delete a pet
      operationId: deletePet
      parameters:
        - name: api_key
          in: header
          description: ''
          required: false
          schema:
            type: string
        - name: petId
          in: path
          description: Pet id to delete
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '400':
          description: Invalid pet value
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /pet/{petId}/uploadImage:
    post:
      tags:
        - pet
      summary: uploads an image
      description: ''
      operationId: uploadFile
      parameters:
        - name: petId
          in: path
          description: ID of pet to update
          required: true
          schema:
            type: integer
            format: int64
        - name: additionalMetadata
          in: query
          description: Additional Metadata
          required: false
          schema:
            type: string
      requestBody:
        content:
          application/octet-stream:
            schema:
              type: string
              format: binary
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
      security:
        - petstore_auth:
            - write:pets
            - read:pets
  /store/inventory:
    get:
      tags:
        - store
      summary: Returns pet inventories by status
      description: Returns a map of status codes to quantities
      operationId: getInventory
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                type: object
                additionalProperties:
                  type: integer
                  format: int32
      security:
        - api_key: []
  /store/order:
    post:
      tags:
        - store
      summary: Place an order for a pet
      description: Place a new order in the store
      operationId: placeOrder
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Order'
          application/xml:
            schema:
              $ref: '#/components/schemas/Order'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Order'
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '405':
          description: Invalid input
  /store/order/{orderId}:
    get:
      tags:
        - store
      summary: Find purchase order by ID
      description: For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
      operationId: getOrderById
      parameters:
        - name: orderId
          in: path
          description: ID of order that needs to be fetched
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'          
            application/xml:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Invalid ID supplied
        '404':
          description: Order not found
    delete:
      tags:
        - store
      summary: Delete purchase order by ID
      description: For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors
      operationId: deleteOrder
      parameters:
        - name: orderId
          in: path
          description: ID of the order that needs to be deleted
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '400':
          description: Invalid ID supplied
        '404':
          description: Order not found
  /user:
    post:
      tags:
        - user
      summary: Create user
      description: This can only be done by the logged in user.
      operationId: createUser
      requestBody:
        description: Created user object
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
          application/xml:
            schema:
              $ref: '#/components/schemas/User'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        default:
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
            application/xml:
              schema:
                $ref: '#/components/schemas/User'
  /user/createWithList:
    post:
      tags:
        - user
      summary: Creates list of users with given input array
      description: Creates list of users with given input array
      operationId: createUsersWithListInput
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/User'
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'          
            application/xml:
              schema:
                $ref: '#/components/schemas/User'
        default:
          description: successful operation
  /user/login:
    get:
      tags:
        - user
      summary: Logs user into the system
      description: ''
      operationId: loginUser
      parameters:
        - name: username
          in: query
          description: The user name for login
          required: false
          schema:
            type: string
        - name: password
          in: query
          description: The password for login in clear text
          required: false
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          headers:
            X-Rate-Limit:
              description: calls per hour allowed by the user
              schema:
                type: integer
                format: int32
            X-Expires-After:
              description: date in UTC when token expires
              schema:
                type: string
                format: date-time
          content:
            application/xml:
              schema:
                type: string
            application/json:
              schema:
                type: string
        '400':
          description: Invalid username/password supplied
  /user/logout:
    get:
      tags:
        - user
      summary: Logs out current logged in user session
      description: ''
      operationId: logoutUser
      parameters: []
      responses:
        default:
          description: successful operation
  /user/{username}:
    get:
      tags:
        - user
      summary: Get user by user name
      description: ''
      operationId: getUserByName
      parameters:
        - name: username
          in: path
          description: 'The name that needs to be fetched. Use user1 for testing. '
          required: true
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'          
            application/xml:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Invalid username supplied
        '404':
          description: User not found
    put:
      tags:
        - user
      summary: Update user
      description: This can only be done by the logged in user.
      operationId: updateUser
      parameters:
        - name: username
          in: path
          description: name that need to be deleted
          required: true
          schema:
            type: string
      requestBody:
        description: Update an existent user in the store
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
          application/xml:
            schema:
              $ref: '#/components/schemas/User'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        default:
          description: successful operation
    delete:
      tags:
        - user
      summary: Delete user
      description: This can only be done by the logged in user.
      operationId: deleteUser
      parameters:
        - name: username
          in: path
          description: The name that needs to be deleted
          required: true
          schema:
            type: string
      responses:
        '400':
          description: Invalid username supplied
        '404':
          description: User not found
components:
  schemas:
    Order:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 10
        petId:
          type: integer
          format: int64
          example: 198772
        quantity:
          type: integer
          format: int32
          example: 7
        shipDate:
          type: string
          format: date-time
        status:
          type: string
          description: Order Status
          example: approved
          enum:
            - placed
            - approved
            - delivered
        complete:
          type: boolean
      xml:
        name: order
    Customer:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 100000
        username:
          type: string
          example: fehguy
        address:
          type: array
          xml:
            name: addresses
            wrapped: true
          items:
            $ref: '#/components/schemas/Address'
      xml:
        name: customer
    Address:
      type: object
      properties:
        street:
          type: string
          example: 437 Lytton
        city:
          type: string
          example: Palo Alto
        state:
          type: string
          example: CA
        zip:
          type: string
          example: '94301'
      xml:
        name: address
    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 1
        name:
          type: string
          example: Dogs
      xml:
        name: category
    User:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 10
        username:
          type: string
          example: theUser
        firstName:
          type: string
          example: John
        lastName:
          type: string
          example: James
        email:
          type: string
          example: john@email.com
        password:
          type: string
          example: '12345'
        phone:
          type: string
          example: '12345'
        userStatus:
          type: integer
          description: User Status
          format: int32
          example: 1
      xml:
        name: user
    Tag:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      xml:
        name: tag
    Pet:
      required:
        - name
        - photoUrls
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 10
        name:
          type: string
          example: doggie
        category:
          $ref: '#/components/schemas/Category'
        photoUrls:
          type: array
          xml:
            wrapped: true
          items:
            type: string
            xml:
              name: photoUrl
        tags:
          type: array
          xml:
            wrapped: true
          items:
            $ref: '#/components/schemas/Tag'
        status:
          type: string
          description: pet status in the store
          enum:
            - available
            - pending
            - sold
      xml:
        name: pet
    ApiResponse:
      type: object
      properties:
        code:
          type: integer
          format: int32
        type:
          type: string
        message:
          type: string
      xml:
        name: '##default'
  requestBodies:
    Pet:
      description: Pet object that needs to be added to the store
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Pet'
        application/xml:
          schema:
            $ref: '#/components/schemas/Pet'
    UserArray:
      description: List of user object
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/User'
  securitySchemes:
    petstore_auth:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: https://petstore3.swagger.io/oauth/authorize
          scopes:
            write:pets: modify pets in your account
            read:pets: read your pets
    api_key:
      type: apiKey
      name: api_key
      in: header`
          let param = new FormData() //创建form对象
          param.append('file', new File([JSON.stringify(json)], 'example_rest.json'))
          param.append('type', '1')
          let config = {
            headers: { 'Content-Type': 'multipart/form-data', ...getHeader() } //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
          } //添加请求头
          axios.post('/api/v1/file/uploadFile', param, config).then(response => {
            console.log(response.data)
          })
        }
      },
      {
        name: 'example_graphqlApi',
        sourceType: 3,
        config: {
          apiNameSpace: 'example_graphqlApi',
          url: 'https://graphql-weather-api.herokuapp.com/',
          loadSchemaFromString: '',
          internal: false,
          customFloatScalars: null,
          customIntScalars: null,
          skipRenameRootFields: null,
          headers: []
        },
        switch: 0,
        createTime: '',
        updateTime: '',
        isDel: 0
      },
      {
        name: 'example_customer',
        sourceType: 4,
        config: {
          apiNamespace: 'example_customer',
          serverName: 'example_customer',
          enableGraphQLEndpoint: false,
          schema:
            "new GraphQLSchema({\n\t\t\t\tquery: new GraphQLObjectType({\n\t\t\t\t\tname: 'RootQueryType',\n\t\t\t\t\tfields: {\n\t\t\t\t\t\thello: {\n\t\t\t\t\t\t\ttype: GraphQLString,\n\t\t\t\t\t\t\tresolve() {\n\t\t\t\t\t\t\t\treturn 'world';\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t},\n\t\t\t\t}),\n\t\t\t}"
        },
        switch: 0,
        createTime: '',
        updateTime: '',
        isDel: 0
      }
    ]
    setExamples(exampleList as any)

    setData(x =>
      x.concat({
        name: intl.formatMessage({ defaultMessage: '示例数据源' }),
        items: exampleList.map(x => {
          return {
            coming: x.coming,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            name: x.name,
            icon: iconMap[`${x.sourceType}_${x.config.dbType ?? ''}`.toLowerCase()],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            sourceType: x.sourceType,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            dbType: x.config.dbType
          }
        })
      })
    )
  }, [])

  function createCustom() {
    const { destroy } = Modal.confirm({
      title: intl.formatMessage({ defaultMessage: '请输入数据源名称' }),
      content: (
        <Input
          autoFocus
          required
          placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
          onChange={e => {
            inputValue.current = e.target.value.replace(/ /g, '')
          }}
        />
      ),
      okText: intl.formatMessage({ defaultMessage: '创建' }),
      cancelText: intl.formatMessage({ defaultMessage: '取消' }),
      okButtonProps: {
        async onClick() {
          if (!inputValue.current) {
            message.error(intl.formatMessage({ defaultMessage: '请输入数据源名称' }))
            return
          }
          let data = {
            name: inputValue.current,
            config: { apiNamespace: inputValue.current, serverName: inputValue.current },
            sourceType: 4,
            switch: 0
          } as any
          const result = await requests.post<unknown, number>('/dataSource', data)
          data.id = result
          handleSave(data)
          destroy()
        }
      }
    })
  }

  async function handleClick(sourceType: number, dbType: string, name: string) {
    if (sourceType === 4) {
      return createCustom()
    }
    let data = {
      id: 0,
      name: '',
      config: { dbType: dbType },
      sourceType: sourceType,
      switch: 0
    } as DatasourceResp

    if (name.startsWith('example_')) {
      // @ts-ignore
      data = examples.find(x => x.name === name)
    }
    // @ts-ignore
    await data.onSelect?.()

    handleCreate(omit(data, ['onSelect']) as DatasourceResp)
  }

  return (
    <>
      {data.map(category => (
        <div key={category.name} className="mb-12">
          <div className={`text-lg ${styles['title']}`}>
            <span className="pl-2.5">{category.name}</span>
          </div>

          <div className="flex flex-wrap my-4 gap-x-9.5 gap-y-5 items-center">
            {category.items.map(x => (
              <div
                key={x.name}
                className="border rounded cursor-pointer flex bg-[#F8F9FD] border-gray-300/20 min-w-53 py-9px pl-4 transition-shadow text-[#333333] w-53 items-center relative hover:shadow-lg"
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onClick={() => !x.coming && handleClick(x.sourceType, x.dbType, x.name)}
              >
                {/* <Image
                    height={28}
                    width={28}
                    src={`/assets/${x.logo}`}
                    alt={x.name}
                    preview={false}
                  /> */}
                <div className="bg-white rounded-3xl h-7 shadow w-7 inline-flex items-center justify-center">
                  <img alt="" src={x.icon} />
                </div>
                <span className={'ml-3' + (x.coming ? ' text-[#787D8B]' : '')}>{x.name}</span>
                {x.coming && (
                  <div className={styles.coming}>
                    {intl.formatMessage({ defaultMessage: '即将' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
