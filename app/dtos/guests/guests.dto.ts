export interface GuestsDto {
	roomNumber: number | null;
	floor: number | null;
	roomType: string | null;
	food: string | null;
	periodOfResidence: number | null;
	arrivalAt: Date | string;
	departureAt: Date | string;
	lastName: string;
	firstName: string;
	age: number | null;
}
type Tourist = {
	lastName: string;
	firstName: string;
	age: string;
};
