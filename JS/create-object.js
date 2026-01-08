var landing = (() => {
	class Landing {

		/**
		 * Contact identifier get parameter name.
		 * @return {string}
		 */
		static get contactIdKey() {
			return "ContactId";
		}

		/**
		 * Bulk email recipient identifier get parameter name.
		 * @return {string}
		 */
		static get bulkEmailRecipientIdKey() {
			return "BulkEmailRecipientId";
		}

		/**
		 * Number of days for cookie expiring.
		 * @return {Number}
		 */
		static get cookieExpireDays() {
			return 7;
		}

		/**
		 * Contact identifier.
		 * @return {Object}
		 */
		get contactId() {
			if (!this._contactId) {
				let contactIdKey = Landing.contactIdKey;
				this._contactId = {
					name: contactIdKey,
					value: Landing.getURLParameter(contactIdKey) || Landing.getCookie(contactIdKey)
				};
			}
			return this._contactId;
		}

		/**
		 * Bulk email recipient identifier.
		 * @return {Object}
		 */
		get bulkEmailRecipientId() {
			if (!this._bulkEmailRecipientId) {
				let bulkEmailRecipientIdKey = Landing.bulkEmailRecipientIdKey;
				this._bulkEmailRecipientId = {
					name: bulkEmailRecipientIdKey,
					value: Landing.getURLParameter(bulkEmailRecipientIdKey) ||
						Landing.getCookie(bulkEmailRecipientIdKey)
				};
			}
			return this._bulkEmailRecipientId;
		}

		/**
		 * Cookie accessor.
		 * @return {string} document's cookie.
		 * @private
		 */
		static get cookie() {
			return document.cookie;
		}

		/**
		 * jQuery accessor.
		 * @return {object} jQuery instance.
		 * @throws {Error} if jQuery not found.
		 * @private
		 */
		static get jQuery() {
			if (!window.jQuery) {
				throw Error("jQuery not found");
			}
			return window.jQuery;
		}

		/**
		 * Config accessor.
		 * @return {object} Landing config.
		 * @throws {Error} if config not found.
		 * @private
		 */
		get config() {
			if (!this._config) {
				throw Error("Config not found");
			}
			return this._config;
		}

		/**
		 * Config setter.
		 * @param {object} value Landing config.
		 */
		set config(value) {
			this._config = value;
		}

		/**
		 * jQuery function.
		 * @return {*} jQuery call result.
		 * @throws {Error} if jQuery not found.
		 * @private
		 */
		static $() {
			if (!window.jQuery) {
				throw Error("jQuery not found");
			}
			return window.jQuery.apply(window.jQuery, arguments);
		}

		/**
		 * Adds Entity column record to fields container.
		 * @param {object} data ajax data object.
		 * @param {Array} data.formFieldsData key - value pair container.
		 * @param {string} name Entity's column name.
		 * @param {*} value Entity's column value.
		 * @private
		 */
		static addFieldRecord(data, name, value) {
			data.formFieldsData.push({
				name: name,
				value: value
			});
		}

		/**
		 * Converts a JSON string into an object.
		 * @param {String} text JSON string.
		 * @returns {Object} An object created from JSON string.
		 * @private
		 */
		static parseResponse(text) {
			text = text.replace("resultCode", "\"resultCode\"");
			text = text.replace("resultMessage", "\"resultMessage\"");
			return JSON.parse(text);
		}

		/**
		 * Returns the value of cookie with the specified key.
		 * @param {String} key The key (cookie name) of the cookie.
		 * @return {String} The value of a specified cookie.
		 * @private
		 */
		static getCookie(key) {
			if (!key) {
				return "";
			}
			let regexp = new RegExp("(?:(?:^|.*;)\\s*" + key + "\\s*\\=\\s*([^;]*).*$)|^.*$");
			return Landing.cookie.replace(regexp, "$1") || "";
		}

		/**
		 * Returns correct cookie key.
		 * @param {String} objectPropertyName The key (property name) of the object.
		 * @return {String} Correct key of a specified cookie.
		 * @private
		 */
		static getCorrectCookiesName(objectPropertyName) {
			 var objectToCookieNames = {
				 "BpmRef" : "bpmRef",
				 "BpmHref" : "bpmHref"
			 };
			 return objectToCookieNames[objectPropertyName];
		}

		/**
		 * Fills ajax data object with Cookie's values.
		 * @param data ajax data object.
		 * @private
		 */
		static setCookiesData(data) {
			for (let name of ["BpmRef", "BpmHref"]) {
				let correctCookieKey = Landing.getCorrectCookiesName(name);
				let cookie = Landing.getCookie(correctCookieKey);
				cookie && Landing.addFieldRecord(data, name, cookie);
			}
		}

		/**
		 * Returns element value by element selector name.
		 * @param {String} selector CSS-selector that choose element.
		 * @returns {String}  The current value of the element.
		 * @private
		 */
		static getElementValueBySelector(selector) {
			let element = Landing.$(selector)[0];
			if (element) {
				if (Landing.$(element).is(":checkbox")) {
					return Landing.$(element).prop("checked");
				}
				return Landing.$(element).val();
			}
			return "";
		}

		/**
		 * Sets element value by selector.
		 * @param {String} selector Element CSS-selector.
		 * @param {String} value Element value.
		 */
		static setElementValueBySelector(selector, value) {
			let element = Landing.$(selector)[0];
			if (element) {
				Landing.$(element).val(value);
			}
		}

		/**
		 * Returns URL parameter by name.
		 * @param {String} name Parameter name.
		 * @return {String}
		 */
		static getURLParameter(name) {
			return decodeURIComponent(
				(RegExp('[?|&]' + name + '=' + '(.+?)(&|$)', 'i').exec(Landing.getLocationSearch()) || [, ""])[1]
			);
		}

		/**
		 * Returns URL querystring part.
		 * @return {String}
		 */
		static getLocationSearch() {
			return location.search;
		}

		/**
		 * Determines if browser is Internet Explorer.
		 * @return {Boolean}
		 */
		static isIE() {
			return (/msie|trident/i).test(window.navigator.userAgent);
		}

		/**
		 * Fills ajax data object with Entity values.
		 * @param data ajax data object.
		 * @private
		 */
		setFieldsData(data) {
			for (let name in this.config.fields) {
				let selector = this.config.fields[name];
				Landing.addFieldRecord(data, name, Landing.getElementValueBySelector(selector));
			}
		}

		/**
		 * Fills ajax data object with Contact values.
		 * @param data ajax data object.
		 * @private
		 */
		 setContactFieldsData(data) {
			for (let name in this.config.contactFields) {
				let selector = this.config.contactFields[name];
				data.contactFieldsData.push({
					name: name,
					value: Landing.getElementValueBySelector(selector)
				});
			}
		}

		/**
		 * Returns an array of object entries.
		 * @returns {Array} Object entries.
		 */
		transformObjectToArray(obj) {
			var ownProps = Object.keys(obj);
			return ownProps.map(function(key) {
				return { name: key, value: obj[key] };
			});
		}

		/**
		 * Returns an object that will sent to the server.
		 * @returns {Object} Data to be sent to the server.
		 * @private
		 */
		getLandingData() {
			let fieldsData = [];
			if (this.config.hasOwnProperty("customFields") && this.config.customFields !== null) {
				fieldsData = this.transformObjectToArray(this.config.customFields);
			}
			let contactFieldsData = [];
			if (this.config.hasOwnProperty("trackingFields") && this.config.trackingFields !== null) {
				contactFieldsData = this.transformObjectToArray(this.config.trackingFields);
			}
			let data = {
				formId: this.config.landingId,
				formFieldsData: fieldsData,
				contactFieldsData: contactFieldsData
			};
			this.setFieldsData(data);
			if (this.config.hasOwnProperty("contactFields") && this.config.contactFields !== null) {
				this.setContactFieldsData(data);
			}
			Landing.setCookiesData(data);
			return data;
		}

		/**
		 * Ajax request error handler.
		 * @param {object} jsxhr XMLHttpRequest instance.
		 * @param {number} status Request status.
		 * @param {string} error Error description.
		 * @private
		 */
		onError(jsxhr, status, error) {
			if (Landing.jQuery.isFunction(this.config.onError)) {
				this.config.onError(jsxhr, status, error);
			}
		}

		/**
		 * Handler to be called when Ajax request complete.
		 * @param {object} response Request response.
		 * @private
		 */
		onComplete(response) {
			if (Landing.jQuery.isFunction(this.config.onComplete)) {
				this.config.onComplete(response);
			}
		}

		/**
		 * Handler to be called when Ajax request is successful and config has onSuccess handler.
		 * @param {object} result Request result.
		 * @private
		 */
		onSuccess(result) {
			if (Landing.jQuery.isFunction(this.config.onSuccess)) {
				this.config.onSuccess(result);
			}
		}

		/**
		 * Handler to be called when Ajax request is successful.
		 * The resultCode property specifies the operation result code: if the operation is completed successfully,
		 * the resultCode value is 0 and if it is not, the resultCode value is -1. If you want to receive a message
		 * that contains the operation result, use the resultMessage property.
		 * @param {object} response Request response.
		 * @private
		 */
		onResponse(response) {
			// response.SaveWebFormLeadDataResult needs for backward capability.
			var isSuccess = response.SaveWebFormLeadDataResult || response.SaveWebFormObjectDataResult;
			if (!isSuccess) {
				return;
			}
			let result = Landing.parseResponse(isSuccess);
			if (this.config.onSuccess) {
				this.onSuccess(result);
			} else if (result.resultCode === 0 && this.config.redirectUrl) {
				this.redirect();
			}
		}

		/**
		 * Redirects to specified in config redirectUrl.
		 * @private
		 */
		redirect() {
			window.location.href = this.config.redirectUrl;
		}

		/**
		 * Creates an object based on the data specified on the page.
		 * Performs an asynchronous HTTP (Ajax) request to the server.
		 * @param {object} config Landing config.
		 * @example
		 *    {
		 * 		fields: {
		 * 			"Contact.Name": "#name",
		 * 			"Contact.Email": "#email",
		 * 			"Contact.Surname": "#last-name",
		 * 			"Contact.Phone": "#phone",
		 * 			"Currency.Name": "#currency",
		 * 			"DueDate": "#due-date",
		 * 			"Comment": "#comment"
		 * 		},
		 * 		contactFields: {
		 * 			"FullName": "#name",
		 * 			"Email": "#email",
		 * 			"Phone": "#phone"
		 * 		},
		 * 		trackingFields: {
		 * 			"VisitorId": "hg93uy45hg"
		 * 		},
		 * 		customFields: {
		 * 			"FormId": "d01e1ba2-29b2-4cbb-a9d9-9b996e6a6e35"
		 * 		},
		 * 		landingId: "d01e1ba2-29b2-4cbb-a9d9-9b996e6a6e35",
		 * 		serviceUrl: "http://some.host/ServiceModel/GeneratedWebFormService.svc/SaveWebFormObjectData",
		 * 		redirectUrl: ""
		 * 	}
		 * @public
		 */
		createObjectFromLanding(config) {
			this.config = config;
			let formData = {formData: this.getLandingData()};
			this.addContactRegistrationInfo(formData.formData);
			Landing.jQuery.ajax({
				url: config.serviceUrl,
				type: "POST",
				data: JSON.stringify(formData),
				contentType: "application/json; charset=UTF-8",
				async: true,
				crossDomain: true,
				error: this.onError.bind(this),
				success: this.onResponse.bind(this),
				complete: this.onComplete.bind(this)
			});
		}

		/**
		 * Adds contact registration information to form data.
		 */
		addContactRegistrationInfo(formData) {
			if (this.contactId.value) {
				formData.formFieldsData.push(this.contactId);
			}
			if (this.bulkEmailRecipientId.value) {
				formData.formFieldsData.push(this.bulkEmailRecipientId);
			}
		}

		/**
		 * Provides backward compatibility.
		 * See {@link #createObjectFromLanding}
		 * @obsolete
		 */
		createLeadFromLanding(config) {
			console.warn('Method "createLeadFromLanding()" is obsolete. Use "createObjectFromLanding()"');
			return this.createObjectFromLanding(config);
		}

		/**
		 * Inits landing page using URL parameters.
		 * @param {Object} config Data specified on the landing page.
		 */
		initLanding(config) {
			if (Landing.isIE()) {
				return;
			}
			for (let field in config.fields) {
				let value = Landing.getURLParameter(field.replace(".", "_"));
				Landing.setElementValueBySelector(config.fields[field], value);
			}
		}
	}

	return new Landing(window.$);
})();
