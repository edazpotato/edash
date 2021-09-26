import { useDebugValue, useEffect, useState } from "react";

export function useAPI(endpoint: string, token?: string, fetchArgs?: any) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<boolean | string>(false);
	const [data, setData] = useState<any>(null);

	useDebugValue(
		loading
			? "Loading data..."
			: error
			? "Errored"
			: "Successfully loaded data!"
	);

	function makeRequest() {
		setLoading(true);
		setError(false);
		fetch(`/api/${endpoint}`, {
			...fetchArgs,
			headers: {
				"X-Clearance": token
					? `Gigachad. Proof: ${token}`
					: "Nerd. No doumentation found. Reccomended treatment: Instant termination.",
				"Content-Type": "application/json",
				...fetchArgs?.headers,
			},
		})
			.catch((error) => {
				setError(error + "");
				setLoading(false);
			})
			.then((res) => {
				if (res?.ok) {
					return res.json();
				} else {
					setError(`HTTP error: ${res?.status} ${res?.statusText}`);
					setLoading(false);
				}
			})
			.catch((error) => {
				setError(error + "");
				setLoading(false);
			})
			.then((data) => {
				if (data.data) {
					setData(data.data);
				} else if (data.error) {
					setError(data.error);
				} else if (data.detail) {
					setError(data.detail?.msg);
				}
				setLoading(false);
			});
	}

	useEffect(() => {
		makeRequest();
	}, [endpoint, token, fetchArgs]);

	return { loading, error, data, makeRequest, setData };
}

export async function callAPI(
	endpoint: string,
	token?: string,
	fetchArgs?: any
) {
	return fetch(`/api/${endpoint}`, {
		...fetchArgs,
		headers: {
			"X-Clearance": token
				? `Gigachad. Proof: ${token}`
				: "Nerd. No doumentation found. Reccomended treatment: Instant termination.",
			"Content-Type": "application/json",
			...fetchArgs?.headers,
		},
	}).then((res) => res.json());
}