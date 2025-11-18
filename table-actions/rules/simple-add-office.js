const { office, officeAssetType, tenantId } = ctx;
const { name, location, counter } = office;

const definition = {
	officeAssetType,
	tenantId,
	name,
	counter,
	...location,
};
console.log(definition);

const response = ctx.toolbox.httpClient.post(`/am/api/v1/assets`, {
	platform: true,
	params: {
		tenantId,
	},
	body: {
		assetTypeId: officeAssetType,
		definition: JSON.stringify(definition),
	},
});

const assetId = (response.headers.Location || response.headers.location)
	.split("/")
	.at(-1)
	.split("?")[0];

if (response.statusCode > 204) {
	return {
		error: true,
		message: `Failed to create asset. Please retry.`,
	};
}
return true;
