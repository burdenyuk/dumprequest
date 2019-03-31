# Dump request

## Requirements

* AWS CLI already configured with Administrator permission
* [NodeJS 8.10+ installed](https://nodejs.org/en/download/)
* [Docker installed](https://www.docker.com/community-edition)

## Setup process

### Local development

**Setting up local env variables**

```bash
cp app/env.example.json app/env.json
```

If you do not have yet DynamoDB created, you can do it using CLI like:
```bash
aws dynamodb create-table --table-name {TABLE_NAME} --attribute-definitions AttributeName=timestamp,AttributeType=N --key-schema AttributeName=timestamp,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```
Then insert `TABLE_NAME` into `app/env.json` that you created above

**Invoking function locally using a local sample payload**

```bash
sam local invoke DumpRequestFunction \
    --event sampleEvent.json \
    --env-vars app/env.json
```
 
**Invoking function locally through local API Gateway**

```bash
sam local start-api --env-vars app/env.json
```

If the previous command ran successfully you should now be able to hit the following local endpoint to invoke your function `http://127.0.0.1:3000/dump`

**Fetch, tail, and filter Lambda function logs**
```bash
sam logs -n DumpRequestFunction --stack-name dump-request-test --tail
```

## Testing

```bash
cd app
npm install
npm run test:unit
```

## Packaging and deployment

For this project CI/CD pipeline is implemented and represented by cloudformation template `pipeline.yaml`.
Whole Cloud formation stack is being rebuilt when you push to master branch of the connected to pipeline github repo.
There are 2 Stages exist. STAGING - for testing functionality. After Staging there is Manual Approval step. You must approve the changes/fixes/etc and only the latest changes will be pushed to PRODUCTION stack.

Alternatively you can package and deploy by hands.

### Setting up CI/CD

#### Prerequisite 

Create bucket for Cloud formation templates
```bash
aws s3 mb s3://dumprequest-templates
```

Create bucket for artifacts that will be produced by AWS CodePipeline
```bash
aws s3 mb s3://dumprequest-artifacts
```

Upload `pipeline.yaml` to S3 bucket
```bash
aws s3 cp pipeline.yaml s3://dumprequest-templates
``` 

Take a look at `pipeline.yaml` and replace parameters related to Github values. 

Create Cloud formation stack in AWS Console or alternatively by AWS CLI:
```bash
aws cloudformation create-stack \
    --stack-name dumpRequestTest \
    --template-url https://s3.eu-central-1.amazonaws.com/dumprequest-templates/pipeline.yaml \
    --parameters ParameterKey=EscalationEmail,ParameterValue={YOUR_EMAIL_TO_GET_NOTIFICATION_ABOUT_FAILURES} \
    --capabilities CAPABILITY_IAM
```

### Alternative Manual approach to Package and Deploy the Project

Package to S3:
```bash
sam package \
    --output-template-file template-packaged.yaml \
    --s3-bucket dumprequest-templates
```

Create Cloudformation Stack and deploy:

```bash
sam deploy \
    --template-file template-packaged.yaml \
    --stack-name dump-request-test \
    --capabilities CAPABILITY_IAM
```

**Cleanup (if needed)**

In order to delete Serverless Application:
```bash
aws cloudformation delete-stack --stack-name dump-request-test
```

### Getting URL to endpoint that was created

After deployment is complete you can run the following command to retrieve the API Gateway Endpoint URL:

```bash
aws cloudformation describe-stacks \
    --stack-name dump-request-test-STAGING \
    --query 'Stacks[].Outputs[?OutputKey==`DumpRequestApi`]' \
    --output table
``` 

