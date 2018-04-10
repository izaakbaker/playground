import { IArtist } from "../rendering/artist";
import { sum, limitMagnitude } from "../math/vector";

export class Particle {
    private static MAX_SPEED: number = 10;
    private static RADIUS: number = 5;
    private static COLOR: number[] = [0, 0, 1];

    private position: number[];
    private velocity: number[];
    private acceleration: number[];
    
    public constructor(initialPosition: number[] = [0, 0], initialVelocity: number[] = [0, 0]) {
        this.position = initialPosition;
        this.velocity = initialVelocity;
        this.acceleration = [0, 0];
    }

    public accelerate(acceleration: number[]): void {
        for (let i = 0; i < this.acceleration.length; i++) {
            this.acceleration[i] += acceleration[i];
        }
    }

    public clearAcceleration(): void {
        for (let i = 0; i < this.acceleration.length; i++) {
            this.acceleration[i] = 0;
        }
    }

    public move(): void {
        this.velocity = sum(this.velocity, this.acceleration);
        this.velocity = limitMagnitude(this.velocity, Particle.MAX_SPEED);
        this.position = sum(this.position, this.velocity);
        this.clearAcceleration();
    }

    public renderWith(artist: IArtist): void {
        artist.fill(Particle.COLOR[0], Particle.COLOR[1], Particle.COLOR[2]);
        artist.ellipse(this.position[0], this.position[1], Particle.RADIUS);
    }

    public getPosition(): number[] {
        return this.position;
    }
}