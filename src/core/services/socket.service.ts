import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";

import { RequestEnergyDataDto } from "./dto/sockets.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  },
})
export class SocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    // private readonly dashboardAndReportsService: DashboardAndReportsService,
  ) { }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("Socket Gateway");

  private clientIntervals: Map<string, NodeJS.Timeout> = new Map();

  private activeClients: Map<string, { connectedAt: Date }> = new Map();

  @SubscribeMessage("requestEnergyData")
  async handleRequestEnergyData(
    client: Socket,
    data: RequestEnergyDataDto,
  ): Promise<void> {
    if (!data.plantId) {
      this.handleError(client, "Plant ID is required to fetch energy data.");
      return;
    }

    try {
      // const query: any = this.buildQuery(data);

      const intervalId = setInterval(async () => {
        try {
          // const energyData =
          //   await this.dashboardAndReportsService.dashboard(query);
          // client.emit("energyData", energyData);
        } catch (error) {
          this.handleError(
            client,
            "Error fetching energy data during streaming.",
            error,
          );
          this.clearClientInterval(client.id);
        }
      }, 2000);

      this.clientIntervals.set(client.id, intervalId);
    } catch (error) {
      this.handleError(
        client,
        "Error initializing energy data streaming.",
        error,
      );
    }
  }

  private handleError(client: Socket, message: string, error?: Error): void {
    client.emit("error", { message });
    this.logger.error(`${message} ${error ? `Details: ${error.message}` : ""}`);
  }

  private buildQuery(data: RequestEnergyDataDto): Record<string, any> {
    return {
      meterId: data?.meterId,
      plantId: data.plantId,
      departmentId: data?.departmentId,
      slabType: data?.slabType,
      year: data?.year,
      month: data?.month,
      day: data?.day,
      startDate: null,
      endDate: null,
    };
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.removeAllListeners();
    this.clearClientInterval(client.id);

    if (this.activeClients.has(client.id)) {
      this.activeClients.delete(client.id);
      this.logger.log(`Client ${client.id} removed from active clients.`);
    }

    this.server.emit("clientDisconnected", { clientId: client.id });
    this.logger.log(`Cleanup completed for client: ${client.id}`);
  }

  private clearClientInterval(clientId: string): void {
    const intervalId = this.clientIntervals.get(clientId);
    if (intervalId) {
      clearInterval(intervalId);
      this.clientIntervals.delete(clientId);
      this.logger.log(`Cleared interval for client: ${clientId}`);
    }
  }

  private async validateToken(token: string): Promise<boolean> {
    // const findUser = await this.userModel.exists({ accessToken: token });
    // if (findUser && findUser._id) return true;
    return false;
  }

  private addToActiveClients(clientId: string): void {
    this.activeClients.set(clientId, { connectedAt: new Date() });
    this.logger.log(`Client ${clientId} added to active clients.`);
  }

  private sendInitialData(client: Socket): void {
    client.emit("welcome", { message: "Welcome to the server!" });
    client.emit("initialData", { timestamp: new Date().toISOString() });
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);

    try {
      const token = client.handshake.auth?.token;
      if (!token || !this.validateToken(token)) {
        this.logger.warn(
          `Unauthorized connection attempt by client: ${client.id}`,
        );
        client.disconnect(true);
        this.handleDisconnect(client);
        return;
      }

      this.addToActiveClients(client.id);

      client.emit("connectionSuccess", {
        message: "Connected to the server successfully!",
      });
      this.server.emit("clientConnected", { clientId: client.id });

      this.sendInitialData(client);
    } catch (error) {
      this.logger.error(
        `Error during connection setup for client ${client.id}: ${error.message}`,
      );
      client.emit("error", {
        message: "An error occurred during connection setup.",
      });
      client.disconnect(true);
    }
  }

  afterInit(server: Server): void {
    server.emit("ready", "Socket Gateway initialized");
    this.logger.log("Socket Gateway initialized");
  }
}
