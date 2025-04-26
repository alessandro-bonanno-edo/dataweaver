type Cloneable = Record<string, unknown> | unknown[] | null;

interface PostMessagePayload {
	source: string;
	payload: {
		type: 'array_mutation';
		source: string;
		dataLayer: Cloneable;
		tc_vars: Cloneable;
		sessionScope: Cloneable;
	};
}

interface WindowWithDWProperties extends Window {
	dataLayer?: unknown[];
	tc_vars?: Record<string, unknown>;
	Odigeo?: {
		SessionScope: Record<string, unknown>;
	};
}

(function () {
	console.log('[Main World] Setting up data tracking with Proxies');
	const win: WindowWithDWProperties = window;

	function createReactiveProxy<T extends object>(target: T, name: string): T {
		const handler: ProxyHandler<T> = {
			set(obj, prop: string | symbol, value: unknown): boolean {
				(obj as Record<string, unknown>)[prop as string] = value;
				return true;
			}
		};

		const proxy = new Proxy(target, handler);

		if (Array.isArray(target)) {
			const originalPush = target.push.bind(target);
			target.push = function (...args: unknown[]): number {
				const result = originalPush(...args);
				const clonedArray = cloneSafe(target);
				const tc_vars = cloneSafe(win.tc_vars || {});
				const sessionScope = cloneSafe(win.Odigeo?.SessionScope || {});

				console.info('[Main World] Array push operation detected:', clonedArray);
				console.info('[Main World] Pushed data:', args, result);

				const message: PostMessagePayload = {
					source: 'DW_DATA',
					payload: {
						type: 'array_mutation',
						source: name,
						dataLayer: clonedArray,
						tc_vars,
						sessionScope
					}
				};

				window.postMessage(message, '*');

				return result;
			};
		}

		return proxy;
	}

	// Safely clone only serializable parts to avoid DataCloneError
	function cloneSafe<T>(obj: T) {
		try {
			return JSON.parse(JSON.stringify(obj));
		} catch (e) {
			console.error('[Main World] Failed to clone object:', e);
			return null; // or handle it differently
		}
	}

	try {
		const proxiedDataLayer = createReactiveProxy(win.dataLayer || [], 'dataLayer');
		const proxiedTcVars = createReactiveProxy(win.tc_vars || {}, 'tc_vars');
		const proxiedSessionScope = createReactiveProxy(win.Odigeo?.SessionScope || {}, 'sessionScope');

		// Optional: re-assign them on window for convenience
		win.dataLayer = proxiedDataLayer;
		win.tc_vars = proxiedTcVars;
		if (win.Odigeo?.SessionScope) {
			win.Odigeo.SessionScope = proxiedSessionScope;
		}

		console.log('[Main World] Proxies set up successfully');
	} catch (err) {
		console.error('[Main World] Failed to set proxies:', err);
	}
})();
