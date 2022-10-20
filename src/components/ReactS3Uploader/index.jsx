import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import S3Upload from './s3Upload'

class ReactS3Uploader extends React.Component {

  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
    this.abort = this.abort.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.droppedfiles && this.props.droppedfiles.length > 0 && prevProps.droppedfiles.length !== this.props.droppedfiles.length){
      this.dropFile(this.props.droppedfiles)
    }
  }

  getInputProps() {
      // declare ref beforehand and filter out
      // `inputRef` by `ReactS3Uploader.propTypes`
      var additional = {
          type: 'file',
          ref: this.props.inputRef
      };

      if ( this.props.autoUpload ) {
          additional.onChange = () => {
            if(ReactDOM.findDOMNode(this).files.length > 0){
              return this.uploadFile();
            }
          };
      }

      var temporaryProps = Object.assign({}, this.props, additional);
      var inputProps = {};

      //var invalidProps = Object.keys(ReactS3Uploader.propTypes);

      for(var key in temporaryProps) {
          if(temporaryProps.hasOwnProperty(key)) {
              inputProps[key] = temporaryProps[key];
          }
      }

      return inputProps;
  }

  uploadFile() {
    console.log("UPLOAD FILE");
      this.myUploader = new S3Upload({
          fileElement: ReactDOM.findDOMNode(this),
          signingUrl: this.props.signingUrl,
          getSignedUrl: this.props.getSignedUrl,
          preprocess: this.props.preprocess,
          onSignedUrl: this.props.onSignedUrl,
          onProgress: this.props.onProgress,
          onFinishS3Put: this.props.onFinish,
          onError: this.props.onError,
          signingUrlMethod: this.props.signingUrlMethod,
          signingUrlHeaders: this.props.signingUrlHeaders,
          signingUrlQueryParams: this.props.signingUrlQueryParams,
          signingUrlWithCredentials: this.props.signingUrlWithCredentials,
          uploadRequestHeaders: this.props.uploadRequestHeaders,
          contentDisposition: this.props.contentDisposition,
          server: this.props.server,
          scrubFilename: this.props.scrubFilename,
          s3path: this.props.s3path
      });
  }

  dropFile(files) {
    console.log("DROP FILE");
      this.myUploader = new S3Upload({
          files: files,
          signingUrl: this.props.signingUrl,
          getSignedUrl: this.props.getSignedUrl,
          preprocess: this.props.preprocess,
          onSignedUrl: this.props.onSignedUrl,
          onProgress: this.props.onProgress,
          onFinishS3Put: this.props.onFinish,
          onError: this.props.onError,
          signingUrlMethod: this.props.signingUrlMethod,
          signingUrlHeaders: this.props.signingUrlHeaders,
          signingUrlQueryParams: this.props.signingUrlQueryParams,
          signingUrlWithCredentials: this.props.signingUrlWithCredentials,
          uploadRequestHeaders: this.props.uploadRequestHeaders,
          contentDisposition: this.props.contentDisposition,
          server: this.props.server,
          scrubFilename: this.props.scrubFilename,
          s3path: this.props.s3path
      });
  }

  abort() {
      this.myUploader && this.myUploader.abortUpload();
  }

  clear() {
      this.clearInputFile(ReactDOM.findDOMNode(this));
  }

  clearInputFile = (f) => {
      if(f.value){
          try{
              f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
          }catch(err){ }
          if(f.value){ //for IE5 ~ IE10
              var form = document.createElement('form'),
                  parentNode = f.parentNode, ref = f.nextSibling;
              form.appendChild(f);
              form.reset();
              parentNode.insertBefore(f,ref);
          }
      }
  }

  render(){
    //return React.createElement('input', this.getInputProps());
    return <React.Fragment/>
  }

}

  ReactS3Uploader.propTypes = {
    signingUrl: PropTypes.string,
    getSignedUrl: PropTypes.func,
    preprocess: PropTypes.func,
    onSignedUrl: PropTypes.func,
    onProgress: PropTypes.func,
    onFinish: PropTypes.func,
    onError: PropTypes.func,
    signingUrlMethod: PropTypes.string,
    signingUrlHeaders: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func
    ]),
    signingUrlQueryParams: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func
    ]),
    signingUrlWithCredentials: PropTypes.bool,
    uploadRequestHeaders: PropTypes.object,
    contentDisposition: PropTypes.string,
    server: PropTypes.string,
    scrubFilename: PropTypes.func,
    s3path: PropTypes.string,
    inputRef: PropTypes.func,
    autoUpload: PropTypes.bool
  }

  ReactS3Uploader.defaultProps = {
      preprocess: function(file, next) {
          console.log('Pre-process: ' + file.name);
          next(file);
      },
      onSignedUrl: function( signingServerResponse ) {
          console.log('Signing server response: ', signingServerResponse);
      },
      onProgress: function(percent, message, file) {
          console.log('Upload progress: ' + percent + '% ' + message);
      },
      onFinish: function(signResult) {
          console.log("Upload finished: " + signResult.publicUrl)
      },
      onError: function(message) {
          console.log("Upload error: " + message);
      },
      server: '',
      signingUrlMethod: 'GET',
      scrubFilename: function(filename) {
          return filename.replace(/[^\w\d_\-\.]+/ig, '');
      },
      s3path: '',
      autoUpload: true
  };

export default ReactS3Uploader;
