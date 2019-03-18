import { request, defaultTransformer } from '../index'

describe('', () => {
  const fakeApi = jest.fn(() => {
    id: 'fake-api-response'
  })

  const requestActionWithDefaultTransformer = request({
    resource: fakeApi,
  })

  const requestActionWithDefaultTransformerExplicit = request({
    resource: fakeApi,
    transform: params => defaultTransformer(params),
  })

  it('should create action with defaultTransformer by default', () =>
    expect(requestActionWithDefaultTransformer).toHaveProperty('type'))

  it('should create action with defaultTransformer explicitly', () =>
    expect(requestActionWithDefaultTransformerExplicit).toHaveProperty('type'))
})
