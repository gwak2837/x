export type TPost2 = (typeof mockedPosts)[number]
export type TPost = { parentPosts?: TPost2[] } & TPost2
export type TReferedPost = NonNullable<TPost['referredPost']>

export const mockedPosts = [
  {
    id: '15',
    createdAt: '2024-10-10T12:20:08.751Z',
    publishAt: '2024-10-10T12:20:08.751Z',
    status: 0,
    content: '1123',
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
  },
  {
    id: '14',
    createdAt: '2024-07-31T15:35:35.465Z',
    updatedAt: '2024-08-17T15:53:37.803Z',
    publishAt: '2024-07-31T15:35:35.465Z',
    status: 0,
    content:
      'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf',
    imageURLs: ['https://pbs.twimg.com/media/GY5vzT6akAArdbU?format=jpg'],
    referredPostId: '13',
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
    referredPost: {
      id: '13',
      createdAt: '2024-07-29T16:10:14.754Z',
      updatedAt: '2024-07-25T15:53:37.803Z',
      publishAt: '2024-07-28T16:10:14.754Z',
      category: 0,
      status: 0,
      content: 'asds',
      imageURLs: [
        'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
        'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
        'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
      ],
      author: {
        id: '42',
        name: '94895fe0-011e-4517-a5fa-c10c0fde4161',
        nickname: 'asd',
      },
    },
    viewCount: 1012,
    commentCount: '1',
  },
  {
    id: '13',
    createdAt: '2024-07-29T16:10:14.754Z',
    updatedAt: '2024-07-25T15:53:37.803Z',
    publishAt: '2024-07-28T16:10:14.754Z',
    status: 0,
    content: 'asds',
    imageURLs: [
      'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
      'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
      'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
    ],
    author: {
      id: '42',
      name: '94895fe0-011e-4517-a5fa-c10c0fde4161',
      nickname: 'asd',
    },
    repostCount: '2',
  },
  {
    id: '9',
    createdAt: '2024-07-29T10:54:13.199Z',
    publishAt: '2024-07-29T10:54:13.199Z',
    status: 0,
    content: 'sdfasdf',
    imageURLs: [
      'https://pbs.twimg.com/media/GY40GtMakAA_Glk?format=jpg',
      'https://pbs.twimg.com/media/GY40GtMakAA_Glk?format=jpg',
    ],
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
  },
  {
    id: '8',
    createdAt: '2024-07-27T16:52:36.186Z',
    publishAt: '2024-07-27T16:52:36.186Z',
    status: 0,
    content: 'asfasdf',
    imageURLs: [
      'https://pbs.twimg.com/media/GYyVjfObIAASojI?format=jpg',
      'https://pbs.twimg.com/media/GYyVjfObIAASojI?format=jpg',
      'https://pbs.twimg.com/media/GYyVjfObIAASojI?format=jpg',
      'https://pbs.twimg.com/media/GY4Ra0ba0AAbJsj?format=jpg',
    ],
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
  },
  {
    id: '7',
    createdAt: '2024-07-27T06:30:56.578Z',
    publishAt: '2024-07-27T06:30:56.578Z',
    status: 0,
    content: 'sadf',
    imageURLs: ['https://pbs.twimg.com/media/GYy1kx4bQAIOH52?format=jpg'],
    referredPostId: '13',
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
    referredPost: {
      id: '13',
      createdAt: '2024-07-29T16:10:14.754Z',
      updatedAt: '2024-07-25T15:53:37.803Z',
      publishAt: '2024-07-28T16:10:14.754Z',
      category: 0,
      status: 0,
      content: 'asds',
      imageURLs: [
        'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
        'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
        'https://pbs.twimg.com/media/GY4w-qgbcAA4XjW?format=jpg',
      ],
      author: {
        id: '42',
        name: '94895fe0-011e-4517-a5fa-c10c0fde4161',
        nickname: 'asd',
      },
    },
    commentCount: '3',
  },
  {
    id: '6',
    createdAt: '2024-07-27T06:30:45.203Z',
    publishAt: '2024-07-27T06:30:45.203Z',
    status: 0,
    content: 'asdf',
    referredPostId: '3',
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
    referredPost: {
      id: '3',
      createdAt: '2024-07-26T11:37:23.225Z',
      publishAt: '2024-07-26T11:37:23.225Z',
      status: 0,
      content: 'asdf12',
      author: {
        id: '35',
        name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
        nickname: '열정적인 유혹자의 질서',
        profileImageURLs: [
          'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
        ],
      },
    },
  },
  {
    id: '5',
    createdAt: '2024-07-26T16:28:01.650Z',
    publishAt: '2024-07-26T16:28:01.650Z',
    status: 0,
    content: 'ㄴㅇㄹㅁㄴㄹㅁㄴㄹㅁㄴㄹ',
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
  },
  {
    id: '4',
    createdAt: '2024-07-26T16:27:43.480Z',
    publishAt: '2024-07-26T16:27:43.480Z',
    status: 0,
    content: 'ㄴㅇㄹ',
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
  },
  {
    id: '3',
    createdAt: '2024-07-26T11:37:23.225Z',
    publishAt: '2024-07-26T11:37:23.225Z',
    status: 0,
    content: 'asdf12',
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
    likeCount: '2',
    commentCount: '2',
    repostCount: '2',
  },
  {
    id: '1',
    createdAt: '2024-07-07T12:46:59.455Z',
    publishAt: '2024-07-07T12:46:59.455Z',
    status: 0,
    content: 'asdfasdf',
    author: {
      id: '35',
      name: '22895fe0-011e-4517-a5fa-c10c0fde4162',
      nickname: '열정적인 유혹자의 질서',
      profileImageURLs: [
        'https://pbs.twimg.com/profile_images/1841000372422524928/9OLUwaH7_400x400.jpg',
      ],
    },
  },
]
