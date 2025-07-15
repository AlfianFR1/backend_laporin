const { getAppDetails } = require('../controllers/homeController');
const { okResponse } = require('../utils/response');

jest.mock('../utils/response', () => ({
  okResponse: jest.fn(),
}));

describe('getAppDetails()', () => {
  it('✅ memanggil okResponse dengan benar', async () => {
    const mockRes = {};
    okResponse.mockImplementation((res, data) => {
      mockRes.data = data;
    });

    await getAppDetails({}, {});

    expect(okResponse).toHaveBeenCalledTimes(1);
    expect(mockRes.data).toMatchObject({
      appName: 'laporin api',
      appVersion: '1.0.0',
    });
  });
});
