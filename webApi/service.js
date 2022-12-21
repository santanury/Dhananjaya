// accessKey
export const accessKey = '108!$kc@nHKRKkbngsppnsg@108';
// GOOGLE API KEY
export const GOOGLE_API_KEY = 'AIzaSyDB30ATBgGVTZXnSKIwYgryIOnDT_GCj3U';

// State URLs
const bangalore = 'http://dhananjaya.iskconbangalore.net:8081/infodeskapitrust';
const hydrabad = 'http://104.41.133.33/infodesktrustapi';
const chennai = 'infodesktrustapi';

// Choose  your state
const state = '1'; // 1. Bangalore 2. Hydredabad 3. Chennai

// baseUrl
export const baseUrl =
  state === '1'
    ? bangalore
    : state === '2'
    ? hydrabad
    : state === '3'
    ? chennai
    : null;

// device verification
export const verify_device = '/authentication/verify-device';
// verify user login
export const verify_user_login = '/authentication/verify-user-login';
// create new pin
export const update_pin = '/authentication/update-pin';
// verify pin
export const verify_user_pin = '/authentication/verify-user-pin';

// PATRON SCREEN ENDPOINTS
// patron list api
export const get_patron_list = '/patron/get-patron-list';
// insert patron api
export const insert_patron_followup = '/patron/insert-patron-followup';

//PATRON DETAILS SCREEN ENDPOINTS
// patron details api
export const get_patron_details = '/patron/get-patron-details';
// patron mailing address
export const get_contact_details = '/patron/get-contact-details';
// get patron photo list
export const get_patron_photo_list = '/patron/get-ptrn-photo-list';
// upload patron image
export const upload_patron_photo = '/patron/upload-ptrn-photo';
//  upgrade patron seva type
export const get_upgrade_seva_type = '/seva/get-seva-type';
// upgrade patron seva list
export const upgrade_seva_list = '/seva/get-upgrade-seva-list';
// upgrade patron
export const upgrade_patron = '/patron/upgrade-patron';
// get patron payment details
export const get_patron_payment_details = '/patron/get-patron-payment-details';
// get other payment details
export const get_other_payment_details = '/patron/get-other-payment-details';
// get bahumana & puja dates details
export const get_bahumana_details = '/patron/get-bahumana-details';
// get puja detail
export const get_puja_detail = '/patron/get-puja-detail';
// get available relationship list with patron
export const get_relationship = '/patron/get-relationship';
// get available occasion list
export const get_occasion = '/patron/get-occasion';
// insert puja details
export const insert_puja = '/patron/insert-puja';
// update puja details
export const update_puja = '/patron/update-puja';
// get accommodation details
export const get_accommodation_details = '/patron/get-accommodation-details';
// update inscription details
export const update_inscription = '/patron/update-inscript';
// bahumana flags & newsletter options
export const get_seva_bahumana = '/seva/get-seva-bahumana';
// add update newsletter
export const add_update_patron_newsletter = '/patron/update-nltr';
// update patronship commentary / publication
export const update_patron_commentary = '/patron/update-commentary';
// tag address for navigation
export const update_patron_address_location = '/patron/update-address-location';
// get tagged addresses for navigation
export const get_patron_address = '/patron/get-patron-address';
// update patron address
export const update_patron_address = '/patron/update-patron-address';
// share payment link
export const share_payment_link = '/receipt/send-payment-link';
// get seva history
export const get_seva_history = '/patron/get-seva-history';
// get patron seva history
export const get_patron_seva_details = '/seva/get-patron-seva-details';

// PATRON SEARCH SCREEN ENDPOINTS
// seva purpose
export const get_seva_type = '/patron/get-seva-type';
// patron preacher list
export const get_patron_preacher_list = '/patron/get-patron-preacher-list';

// COMMENT SCREEN ENDPOINTS
// post / insert comment
export const insert_posting_comment = '/patron/insert-posting-comment';
// get comment list
export const get_comment_details = '/patron/get-comment-details';

// DONOR SCREEN ENDPOINTS
// donor list api
export const get_donor_list = '/donor/get-donor-list';
// insert donor followup
export const insert_donor_followup = '/donor/insert-donor-followup';

// DONOR DETAILS SCREEN ENDPOINTS
// donor details api
export const get_donor_details = '/donor/get-donor-details';
// tag address for navigation
export const update_daonor_address_location = '/donor/update-address-location';
// get tagged address for navigation
export const get_donor_address = '/donor/get-donor-address';
// update donor address
export const update_donor_address = '/donor/update-donor-address';

// DONOR SEARCH SCREEN ENDPOINTS
// donor preacher list
export const get_donor_preacher_list = '/donor/get-donor-preacher-list';

// PROSPECT SCREEN ENDPOINTS
// prospect list api
export const get_prospect_list = '/prospect/get-prospect-list';
// insert prospect followup
export const insert_prospect_followup = '/prospect/insert-prospect-followup';
// create prospect
export const create_prospect = '/prospect/create-prospect';
// get prospect details
export const get_prospect_details = '/prospect/get-prospect-details/';
// get prospect address
export const get_prospect_address = '/prospect/get-prospect-address/';
// update prospect address
export const update_prospect_address = '/prospect/update-prospect-address';

// FOLLOWUP SCREEN ENDPOINTS
// get patron followup list
export const get_patron_followup_list = '/patron/get-followup-list';
// get donor followup list
export const get_donor_followup_list = '/donor/get-followup-list';
// get prospect followup list
export const get_prospect_followup_list = '/prospect/get-followup-list';

// DONATION SCREENS ENDPOINTS
// get category list
export const get_seva_category_list = '/seva/get-category-list';
// get sub category list
export const get_seva_sub_category_list = '/seva/get-sub-category-list';
// get seva details
export const get_seva_details = '/seva/get-seva-detail';
// get slot detail
export const get_slot_detail = '/seva/get-slot-detail';
// generate manual receipt
export const generate_manual_receipt = '/seva/generate-manual-receipt';
// search dr data
export const search_dr_data = '/seva/search-dr-data';
// donor linked patron data
export const get_patron_list_for_donor = '/seva/get-patron-list';
// get salutaions list
export const get_salutation_list = '/patron/get-salutation-list';
// create donor
export const create_donor = '/seva/create-donor';

// DONATION RECEIPT
// get currency list
export const get_currency_list = '/receipt/get-currency-list';
// get blocked slot
export const get_blocked_slot = '/seva/get-blocked-slot/';

// generate app receipt
export const generate_app_receipt = '/receipt/generate-app-receipt';

// ENROLMENT SCREEN ENDPOINTS
// save unfinish enrolment data
export const create_patron_stage = '/patron/create-patron-stage';
// fetch unfinished enrolment data
export const get_patron_stage = '/patron/get-patron-stage';
// create_patron
export const create_patron = '/patron/create-patron';

// INVITEES ENDPOINTS
// get invitees list
export const get_invitee_list = '/patron/get-invitee-list';

// RECEIPT ENDPOINTS
// get receipt list
export const get_preacher_receipt_list = '/receipt/get-preacher-receipt-list';

// COLLECTION HISTORY
// get donation details
export const get_donation_details = '/receipt/get-donation-details';

// $ QRCODE SCREEN ENDPOINTS
// $ send payment link
export const send_payment_link = '/receipt/send-prcr-payment-link';

// $ COLLECTTION REPORTS ENDPOINTS
// $ get preacheer collection
export const get_collection_report = '/receipt/get-preacher-collection';
// change pin
export const change_pin = '/authentication/change-pin';

// MIS REPORT ENDPOINTS
// year wise report
export const get_year_collection_report = '/receipt/get-year-collection-report';
// month wise report
export const get_month_collection_report =
  '/receipt/get-month-collection-report';
// annadana year wise report
export const get_annadana_year_collection =
  '/receipt/get-annadana-year-collection';
// annadana month wise report
export const get_annadana_month_collection =
  '/receipt/get-annadana-month-collection';
// preacher collection report
export const get_preacher_collection_report =
  '/receipt/get-preacher-collection-report';
// kind donation report
export const get_kind_donation_details = '/receipt/get-kind-donation-details';
// frdc attendance report
export const get_frdc_attendance = '/receipt/get-frdc-attendance';
// preacher wise yearly report
export const get_year_preacher_collection =
  '/receipt/get-year-preacher-collection';
// preacher wise monthly report
export const get_preacher_month_collection =
  '/receipt/get-preacher-month-collection';
// vk hill collection report
export const get_vkhill_collection = '/receipt/get-vkhill-collection';
// gunjur collection report
export const get_gunjur_collection = '/receipt/get-gunjur-collection';
// avalabetta collection report
export const get_avalabetta_collection = '/receipt/get-avalabetta-collection';

// SP ASHRAYA
export const sevaApiBase = 'http://dhananjaya.iskconbangalore.net:8081/sevaapi';
// get ashraya list
export const get_ashraya_list = '/seva/get-ashraya-list';
// get next level
export const get_next_level = '/seva/get-next-level';
// get language list
export const get_language_list = '/seva/get-language-list';
// update level details
export const update_level_details = '/seva/update-level-details';
// get level list
export const get_level_list = '/seva/get-level-list';
// update people count
export const update_people_count = '/seva/update-people-count';
// add ashraya base web url
export const addAshrayaBaseWeb =
  'https://www.iskconbangalore.org/dev-srila-prabhupada-ashraya/?prcr=';

// TICKETING
// base url
export const ticketing_baseUrl =
  'http://dhananjaya.iskconbangalore.net:8081/itimsapi';
// get user ticket list
export const get_user_ticket_list = '/ticket/get-user-ticket-list';
// insert ticket feedback
export const insert_ticket_feedback = '/ticket/insert-ticket-feedback';
// insert ticket details
export const insert_ticket_details = '/ticket/insert-ticket-details';
// get my work updates
export const get_my_work_updates = '/ticket/get-my-work-updates';
