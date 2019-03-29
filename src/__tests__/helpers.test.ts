import {
  makeType,
  getKey,
  normalizeList,
  denormalizeList,
  addArrayToNormalizedList,
  setLinkedData,
} from '../helpers'
import { actionTypes } from '../constants'

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

const listNew = [
  {
    uniqId: '50',
    notUniqId: '789',
    notUniqCategory: 'j9',
    content: `Doesn't matter at all`,
  },
  {
    uniqId: '51',
    notUniqId: 'a32454b231',
    notUniqCategory: 'k3',
    content: `Doesn't matter totally`,
  },
  {
    uniqId: '43',
    notUniqId: 'ab231',
    notUniqCategory: 'bb123',
    content: `Duplication/merge test`,
  },
]

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

const normalizedExampleStringKey = {
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
  additional: {
    45: {
      desc: 'Additional data mapped to element with id = 45',
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

test('makeType', () => {
  expect(makeType('GET_NOTES', actionTypes.Request)).toBe('async/GET_NOTES/REQUEST')
  expect(makeType('GET_NOTES', actionTypes.Fail)).toBe('async/GET_NOTES/FAIL')
  expect(makeType('', actionTypes.Request)).toBe('async/REQUEST')
  expect(makeType('', actionTypes.Fail)).toBe('async/FAIL')
})

describe('getKey', () => {
  const entity = {
    uniqId: '42',
    notUniqId: 'a231',
    notUniqCategory: 'b123',
    content: `Doesn't matter`,
  }
  test('empty', () => {
    expect(getKey(entity, 'notFound')).toBe('')
  })
  test('null', () => {
    // @ts-ignore
    expect(getKey(null, 'notFound')).toBe('')
  })
  test('empty object', () => {
    expect(getKey({}, 'notFound')).toBe('')
  })
  test('empty with array', () => {
    expect(getKey(entity, ['notFound', 'notFound2'])).toBe('')
  })
  test('prop list', () => {
    expect(getKey(entity, ['notUniqId', 'notUniqCategory'])).toBe('a231_b123')
  })
  test('one prop', () => {
    expect(getKey(entity, 'uniqId')).toBe('42')
  })
})

describe('normalizeList', () => {
  test('empty', () => {
    expect(normalizeList([])).toEqual({
      ids: [],
      data: {},
      denormalized: [],
    })
  })
  test('by one key prop', () => {
    expect(normalizeList(list, 'uniqId')).toEqual({
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
    })
  })
  test('by one key prop which is not exist', () => {
    expect(normalizeList(list, 'wrongKey')).toEqual({
      ids: [0, 1, 2, 3],
      data: {
        0: {
          uniqId: '42',
          notUniqId: 'aa231',
          notUniqCategory: 'ba123',
          content: `Doesn't matter one`,
        },
        1: {
          uniqId: '43',
          notUniqId: 'ab231',
          notUniqCategory: 'bb123',
          content: `Doesn't matter two`,
        },
        2: {
          uniqId: '44',
          notUniqId: 'ac231',
          notUniqCategory: 'bc123',
          content: `Doesn't matter three`,
        },
        3: {
          uniqId: '45',
          notUniqId: 'ad231',
          notUniqCategory: 'bd123',
          content: `Doesn't matter four`,
        },
      },
      denormalized: list,
    })
  })
  test('by list of key props', () => {
    expect(normalizeList(list, ['notUniqId', 'notUniqCategory'])).toEqual({
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
      denormalized: list,
    })
  })
})

describe('denormalizeList', () => {
  test('Make flat array from normalized list object with array key', () => {
    expect(denormalizeList(normalizedExampleArrayKey)).toEqual(list)
  })
  test('string key', () => {
    expect(denormalizeList(normalizedExampleStringKey)).toEqual(list)
  })
})

describe('addArrayToNormalizedList', () => {
  test('Add array to normalized list with data merge by string id', () => {
    expect(
      addArrayToNormalizedList(normalizedExampleStringKey, listNew, 'uniqId'),
    ).toEqual({
      ids: ['42', '43', '44', '45', '50', '51'],
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
          content: `Duplication/merge test`,
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
          notUniqId: '789',
          notUniqCategory: 'j9',
          content: `Doesn't matter at all`,
        },
        51: {
          uniqId: '51',
          notUniqId: 'a32454b231',
          notUniqCategory: 'k3',
          content: `Doesn't matter totally`,
        },
      },
      additional: {
        45: {
          desc: 'Additional data mapped to element with id = 45',
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
          content: `Duplication/merge test`,
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
        {
          uniqId: '50',
          notUniqId: '789',
          notUniqCategory: 'j9',
          content: `Doesn't matter at all`,
        },
        {
          uniqId: '51',
          notUniqId: 'a32454b231',
          notUniqCategory: 'k3',
          content: `Doesn't matter totally`,
        },
      ],
    })
  })

  test('By string id without data merge', () => {
    expect(
      addArrayToNormalizedList(normalizedExampleStringKey, listNew, 'uniqId', true),
    ).toEqual({
      ids: ['42', '43', '44', '45', '50', '51'],
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
          notUniqId: '789',
          notUniqCategory: 'j9',
          content: `Doesn't matter at all`,
        },
        51: {
          uniqId: '51',
          notUniqId: 'a32454b231',
          notUniqCategory: 'k3',
          content: `Doesn't matter totally`,
        },
      },
      additional: {
        45: {
          desc: 'Additional data mapped to element with id = 45',
        },
      },
      denormalized: [
        ...list,
        {
          uniqId: '50',
          notUniqId: '789',
          notUniqCategory: 'j9',
          content: `Doesn't matter at all`,
        },
        {
          uniqId: '51',
          notUniqId: 'a32454b231',
          notUniqCategory: 'k3',
          content: `Doesn't matter totally`,
        },
      ],
    })
  })
  test('add array to normalized list, use key array', () => {
    expect(
      addArrayToNormalizedList(normalizedExampleArrayKey, listNew, [
        'notUniqId',
        'notUniqCategory',
      ]),
    ).toEqual({
      ids: [
        'aa231_ba123',
        'ab231_bb123',
        'ac231_bc123',
        'ad231_bd123',
        '789_j9',
        'a32454b231_k3',
      ],
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
          content: `Duplication/merge test`,
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
        '789_j9': {
          uniqId: '50',
          notUniqId: '789',
          notUniqCategory: 'j9',
          content: `Doesn't matter at all`,
        },
        a32454b231_k3: {
          uniqId: '51',
          notUniqId: 'a32454b231',
          notUniqCategory: 'k3',
          content: `Doesn't matter totally`,
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
          content: `Duplication/merge test`,
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
        {
          uniqId: '50',
          notUniqId: '789',
          notUniqCategory: 'j9',
          content: `Doesn't matter at all`,
        },
        {
          uniqId: '51',
          notUniqId: 'a32454b231',
          notUniqCategory: 'k3',
          content: `Doesn't matter totally`,
        },
      ],
    })
  })
})

describe('setLinkedData', () => {
  test('add array of mapped data', () => {
    const id = 43
    const dataField = 'history'
    const data = [
      {
        id: '467',
        amount: 20023,
      },
      {
        id: '468',
        amount: 100000,
      },
    ]

    expect(setLinkedData(normalizedExampleStringKey, id, data, dataField)).toEqual({
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
      additional: {
        45: {
          desc: 'Additional data mapped to element with id = 45',
        },
      },
      history: {
        43: data,
      },
      denormalized: list,
    })
  })
  test('add array of mapped data to empty object', () => {
    const initialState = normalizeList()
    const id = 43
    const dataField = 'history'
    const data = [
      {
        id: '467',
        amount: 20023,
      },
      {
        id: '468',
        amount: 100000,
      },
    ]

    expect(setLinkedData(initialState, id, data, dataField)).toEqual({
      ids: [],
      data: {},
      history: {
        43: data,
      },
      denormalized: [],
    })
  })
})
