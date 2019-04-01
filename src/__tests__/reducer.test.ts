import { setResult } from '../reducers'
import { AsyncState } from '../AsyncState'
import { defaultTransformer } from '../transformers'

const list = [
  {
    uniqId: '42',
    notUniqId: 'aa231',
    notUniqCategory: 'ba123',
    content: `Doesn't matter one`,
  },
  {
    uniqId: '43',
    notUniqId: 'ab231',
    notUniqCategory: 'bb123',
    content: `Doesn't matter two`,
  },
  {
    uniqId: '44',
    notUniqId: 'ac231',
    notUniqCategory: 'bc123',
    content: `Doesn't matter three`,
  },
  {
    uniqId: '45',
    notUniqId: 'ad231',
    notUniqCategory: 'bd123',
    content: `Doesn't matter four`,
  },
]

const normalizedList = {
  ids: ['42', '43', '44', '45'],
  data: {
    42: {
      uniqId: '42',
      notUniqId: 'aa231',
      notUniqCategory: 'ba123',
      content: `Doesn't matter one`,
    },
    43: {
      uniqId: '43',
      notUniqId: 'ab231',
      notUniqCategory: 'bb123',
      content: `Doesn't matter two`,
    },
    44: {
      uniqId: '44',
      notUniqId: 'ac231',
      notUniqCategory: 'bc123',
      content: `Doesn't matter three`,
    },
    45: {
      uniqId: '45',
      notUniqId: 'ad231',
      notUniqCategory: 'bd123',
      content: `Doesn't matter four`,
    },
  },
  denormalized: list,
}

const normalizedExampleArrayKey = {
  ids: ['aa231_ba123', 'ab231_bb123', 'ac231_bc123', 'ad231_bd123'],
  data: {
    aa231_ba123: {
      uniqId: '42',
      notUniqId: 'aa231',
      notUniqCategory: 'ba123',
      content: `Doesn't matter one`,
    },
    ab231_bb123: {
      uniqId: '43',
      notUniqId: 'ab231',
      notUniqCategory: 'bb123',
      content: `Doesn't matter two`,
    },
    ac231_bc123: {
      uniqId: '44',
      notUniqId: 'ac231',
      notUniqCategory: 'bc123',
      content: `Doesn't matter three`,
    },
    ad231_bd123: {
      uniqId: '45',
      notUniqId: 'ad231',
      notUniqCategory: 'bd123',
      content: `Doesn't matter four`,
    },
  },
  denormalized: [
    {
      uniqId: '42',
      notUniqId: 'aa231',
      notUniqCategory: 'ba123',
      content: `Doesn't matter one`,
    },
    {
      uniqId: '43',
      notUniqId: 'ab231',
      notUniqCategory: 'bb123',
      content: `Doesn't matter two`,
    },
    {
      uniqId: '44',
      notUniqId: 'ac231',
      notUniqCategory: 'bc123',
      content: `Doesn't matter three`,
    },
    {
      uniqId: '45',
      notUniqId: 'ad231',
      notUniqCategory: 'bd123',
      content: `Doesn't matter four`,
    },
  ],
}

const loadMoreList = [
  {
    uniqId: '50',
    notUniqId: 'LoadedLater',
    notUniqCategory: '1r2',
    content: `Loaded later on "Load more" button click`,
  },
]

describe('setResult', () => {
  const history = [
    {
      id: '467',
      amount: 20023,
    },
    {
      id: '468',
      amount: 100000,
    },
  ]

  test('setResult: SUCCESS', () => {
    const asyncState = new AsyncState()
    expect(
      setResult({
        action: { type: 'SUCCESS', payload: { data: list } },
        asyncState,
        transform: defaultTransformer,
        transformParams: { keyProp: 'uniqId' },
      }),
    ).toEqual({
      isFetching: false,
      isSuccess: false,
      error: undefined,
      result: normalizedList,
      rawResponse: list,
    })
  })
  test('setResult: SUCCESS with array key', () => {
    const asyncState = new AsyncState()
    expect(
      setResult({
        action: { type: 'SUCCESS', payload: { data: list } },
        asyncState,
        transform: defaultTransformer,
        transformParams: {
          keyProp: ['notUniqId', 'notUniqCategory'],
        },
      }),
    ).toEqual({
      isFetching: false,
      isSuccess: false,
      error: undefined,
      result: normalizedExampleArrayKey,
      rawResponse: list,
    })
  })

  test('setResult: loadMore', () => {
    const asyncState = {
      isFetching: false,
      isSuccess: false,
      result: normalizedList,
      rawResponse: list,
    }

    expect(
      setResult({
        action: { type: 'SUCCESS', payload: { data: loadMoreList } },
        asyncState,
        transform: defaultTransformer,
        transformParams: {
          keyProp: 'uniqId',
          withMerging: true,
        },
      }),
    ).toEqual({
      isFetching: false,
      isSuccess: false,
      error: undefined,
      rawResponse: loadMoreList,
      result: {
        ids: ['42', '43', '44', '45', '50'],
        data: {
          42: {
            uniqId: '42',
            notUniqId: 'aa231',
            notUniqCategory: 'ba123',
            content: `Doesn't matter one`,
          },
          43: {
            uniqId: '43',
            notUniqId: 'ab231',
            notUniqCategory: 'bb123',
            content: `Doesn't matter two`,
          },
          44: {
            uniqId: '44',
            notUniqId: 'ac231',
            notUniqCategory: 'bc123',
            content: `Doesn't matter three`,
          },
          45: {
            uniqId: '45',
            notUniqId: 'ad231',
            notUniqCategory: 'bd123',
            content: `Doesn't matter four`,
          },
          50: {
            uniqId: '50',
            notUniqId: 'LoadedLater',
            notUniqCategory: '1r2',
            content: `Loaded later on "Load more" button click`,
          },
        },
        denormalized: [
          ...list,
          {
            uniqId: '50',
            notUniqId: 'LoadedLater',
            notUniqCategory: '1r2',
            content: `Loaded later on "Load more" button click`,
          },
        ],
      },
    })
  })

  test('setResult when result has additional data: should save it and set new [data]', () => {
    const asyncState = {
      isFetching: false,
      isSuccess: false,
      error: undefined,
      result: {
        ids: [],
        data: {},
        denormalized: [],
        history,
      },
    }

    expect(
      setResult({
        action: { type: 'SUCCESS', payload: { data: list } },
        asyncState,
        transform: defaultTransformer,
        transformParams: { keyProp: 'uniqId' },
      }),
    ).toEqual({
      isFetching: false,
      isSuccess: false,
      error: undefined,
      rawResponse: list,
      result: {
        ...normalizedList,
        history,
      },
    })
  })

  test('set additional result linked to data', () => {
    const asyncState = {
      isFetching: false,
      isSuccess: false,
      error: undefined,
      result: normalizedList,
    }

    const parentId = 43

    expect(
      setResult({
        action: { type: 'SUCCESS', payload: { data: history } },
        asyncState,
        transform: defaultTransformer,
        transformParams: {
          keyProp: 'uniqId',
          resultKey: 'history',
          parentId,
        },
      }),
    ).toEqual({
      isFetching: false,
      isSuccess: false,
      error: undefined,
      rawResponse: history,
      result: {
        ...normalizedList,
        history: {
          43: history,
        },
      },
    })
  })

  test('add additional result linked to data', () => {
    const asyncState = {
      isFetching: false,
      isSuccess: false,
      error: undefined,
      result: normalizedList,
    }

    const updatedState = setResult({
      action: { type: 'SUCCESS', payload: { data: history } },
      asyncState,
      transform: defaultTransformer,
      transformParams: {
        keyProp: 'uniqId',
        resultKey: 'history',
        parentId: 43,
      },
    })

    expect(
      setResult({
        action: { type: 'SUCCESS', payload: { data: history } },
        asyncState: updatedState,
        transform: defaultTransformer,
        transformParams: {
          keyProp: 'uniqId',
          resultKey: 'history',
          parentId: 44,
        },
      }),
    ).toEqual({
      isFetching: false,
      isSuccess: false,
      error: undefined,
      rawResponse: history,
      result: {
        ...normalizedList,
        history: {
          43: history,
          44: history,
        },
      },
    })
  })
})
