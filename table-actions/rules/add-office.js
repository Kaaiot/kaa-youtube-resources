const { office_ids = [] } = ctx;

const checkResponseStatus = (response) => {
	const statusCode = response.statusCode;
	console.log(response);
	console.log(`>>> Status code: ${statusCode}`);

	if (statusCode > 204) {
		console.log(`>>> Error message: ${response.error}`);
		return false;
	}

	return true;
};

const getAsset = (asset_id) => {
	const response = ctx.toolbox.httpClient.get(
		`/am/api/v1/assets/${asset_id}`,
		{
			platform: true,
		}
	);

	const asset = response?.body?.definition;
	if (checkResponseStatus(response) && asset) {
		return JSON.parse(asset);
	}

	return null;
};

const increment = (asset_id, counter) => {
	const response = ctx.toolbox.httpClient.patch(
		`/am/api/v1/assets/${asset_id}`,
		{
			platform: true,
			body: {
				operations: [
					{
						op: "replace",
						path: "/counter",
						value: counter + 1,
					},
				],
			},
		}
	);

	return checkResponseStatus(response);
};

for (const office_id of office_ids) {
	try {
		const office = getAsset(office_id);
		const counter = office?.counter;
		console.log(counter);

		if (counter || counter == 0) {
			increment(office_id, counter);
		}
	} catch (e) {
		console.log(e);
		continue;
	}
}

return true;
